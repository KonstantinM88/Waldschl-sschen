const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const ADMIN_SESSION_COOKIE = "wald_admin_session";
export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_DASHBOARD_PATH = "/admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

interface AdminSessionPayload {
  exp: number;
  sub: string;
}

interface AdminAuthConfig {
  password: string;
  secret: string;
  username: string;
}

function encodeBase64Url(input: Uint8Array) {
  let binary = "";

  for (const byte of input) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4)) % 4;
  const binary = atob(`${normalized}${"=".repeat(padding)}`);
  const output = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    output[index] = binary.charCodeAt(index);
  }

  return output;
}

function constantTimeEqual(left: string, right: string) {
  const leftBytes = textEncoder.encode(left);
  const rightBytes = textEncoder.encode(right);
  const maxLength = Math.max(leftBytes.length, rightBytes.length);
  let diff = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < maxLength; index += 1) {
    diff |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return diff === 0;
}

async function signValue(value: string, secret: string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, textEncoder.encode(value));
  return encodeBase64Url(new Uint8Array(signature));
}

function getAdminAuthConfig(): AdminAuthConfig | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!username || !password || !secret) {
    return null;
  }

  return {
    username,
    password,
    secret,
  };
}

export function isAdminAuthConfigured() {
  return getAdminAuthConfig() !== null;
}

export function normalizeAdminNextPath(nextPath?: string | null) {
  if (!nextPath || !nextPath.startsWith("/admin")) {
    return ADMIN_DASHBOARD_PATH;
  }

  return nextPath;
}

export async function validateAdminCredentials(username: string, password: string) {
  const config = getAdminAuthConfig();
  if (!config) {
    return false;
  }

  return constantTimeEqual(username.trim(), config.username) && constantTimeEqual(password, config.password);
}

export async function createAdminSessionToken(username: string) {
  const config = getAdminAuthConfig();
  if (!config) {
    throw new Error("Admin auth is not configured.");
  }

  const payload: AdminSessionPayload = {
    sub: username.trim(),
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE,
  };

  const encodedPayload = encodeBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const signature = await signValue(encodedPayload, config.secret);

  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionToken(token?: string | null) {
  const config = getAdminAuthConfig();
  if (!config || !token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = await signValue(encodedPayload, config.secret);
  if (!constantTimeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(textDecoder.decode(decodeBase64Url(encodedPayload))) as AdminSessionPayload;

    if (!payload?.sub || typeof payload.exp !== "number") {
      return null;
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}
