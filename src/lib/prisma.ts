import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const PG_SSLMODE_ALIASES = new Set(["prefer", "require", "verify-ca"]);

function normalizeConnectionString(connectionString: string) {
  try {
    const url = new URL(connectionString);
    const sslmode = url.searchParams.get("sslmode")?.toLowerCase();
    const useLibpqCompat =
      url.searchParams.get("uselibpqcompat")?.toLowerCase() === "true";

    if (sslmode && PG_SSLMODE_ALIASES.has(sslmode) && !useLibpqCompat) {
      url.searchParams.set("sslmode", "verify-full");
      return url.toString();
    }
  } catch {
    return connectionString;
  }

  return connectionString;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  const adapter = new PrismaPg({
    connectionString: normalizeConnectionString(connectionString),
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
