import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const ogDir = path.join(publicDir, "og");

const castlePaths = `
  <path d="M9 55.5H63" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M14 55.5V35.5L22.5 27.5L31 35.5V55.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M41 55.5V24L50 16L59 24V55.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22.5 27.5H50" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M47 55.5V41.5H53V55.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M18.5 41H26.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M45.5 29.5H54.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M50 16V11.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M47 13.5H53" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
`;

const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="33%" cy="22%" r="82%">
      <stop offset="0%" stop-color="#4a3a28"/>
      <stop offset="52%" stop-color="#211914"/>
      <stop offset="100%" stop-color="#0f0d0a"/>
    </radialGradient>
    <linearGradient id="ring" x1="92" y1="70" x2="430" y2="448">
      <stop offset="0%" stop-color="#fff1c6"/>
      <stop offset="50%" stop-color="#d8bd84"/>
      <stop offset="100%" stop-color="#8d6e35"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="118" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="189" stroke="url(#ring)" stroke-width="18"/>
  <circle cx="256" cy="256" r="156" stroke="#f2d49b" stroke-opacity="0.24" stroke-width="3"/>
  <g transform="translate(90 86) scale(4.6)" color="#f2d49b">
    ${castlePaths}
  </g>
  <path d="M158 386C201 412 309 412 354 386" stroke="#d8bd84" stroke-width="10" stroke-linecap="round" opacity="0.72"/>
</svg>
`;

const previewOverlaySvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1200" y2="0">
      <stop offset="0%" stop-color="#120f0c" stop-opacity="0.92"/>
      <stop offset="44%" stop-color="#120f0c" stop-opacity="0.76"/>
      <stop offset="78%" stop-color="#120f0c" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="#120f0c" stop-opacity="0.06"/>
    </linearGradient>
    <radialGradient id="glow" cx="18%" cy="28%" r="58%">
      <stop offset="0%" stop-color="#d8bd84" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="#d8bd84" stop-opacity="0"/>
    </radialGradient>
    <style>
      .serif { font-family: Georgia, 'Times New Roman', serif; }
      .sans { font-family: Arial, Helvetica, sans-serif; }
      .script { font-family: Georgia, 'Times New Roman', serif; font-style: italic; }
    </style>
  </defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="56" y="54" width="1088" height="522" rx="38" stroke="#f2d49b" stroke-opacity="0.24" stroke-width="2"/>
  <circle cx="143" cy="139" r="48" fill="#15120f" fill-opacity="0.72" stroke="#f2d49b" stroke-opacity="0.72" stroke-width="2"/>
  <g transform="translate(99 95) scale(1.22)" color="#f2d49b">
    ${castlePaths}
  </g>
  <text x="214" y="122" class="sans" fill="#f2d49b" font-size="21" font-weight="700" letter-spacing="6">HOTEL &amp; RESTAURANT</text>
  <text x="92" y="286" class="script" fill="#fff7e6" font-size="96" font-weight="400">Waldschl&#246;sschen</text>
  <text x="96" y="344" class="serif" fill="#f2d49b" font-size="38" font-weight="400" letter-spacing="1.2">Saale-Unstrut</text>
  <rect x="96" y="382" width="154" height="2" rx="1" fill="#d8bd84"/>
  <text x="96" y="441" class="sans" fill="#ffffff" fill-opacity="0.88" font-size="30" font-weight="400">Boutique-Hotel &#183; Restaurant &#183; Events</text>
  <text x="96" y="492" class="sans" fill="#ffffff" fill-opacity="0.62" font-size="22" font-weight="400">Gastlichkeit an der Arche Nebra</text>
</svg>
`;

function createIco(pngImages) {
  const headerSize = 6;
  const entrySize = 16;
  const directorySize = headerSize + entrySize * pngImages.length;
  const totalSize = directorySize + pngImages.reduce((sum, image) => sum + image.buffer.length, 0);
  const ico = Buffer.alloc(totalSize);

  ico.writeUInt16LE(0, 0);
  ico.writeUInt16LE(1, 2);
  ico.writeUInt16LE(pngImages.length, 4);

  let imageOffset = directorySize;
  pngImages.forEach((image, index) => {
    const entryOffset = headerSize + entrySize * index;
    ico.writeUInt8(image.size >= 256 ? 0 : image.size, entryOffset);
    ico.writeUInt8(image.size >= 256 ? 0 : image.size, entryOffset + 1);
    ico.writeUInt8(0, entryOffset + 2);
    ico.writeUInt8(0, entryOffset + 3);
    ico.writeUInt16LE(1, entryOffset + 4);
    ico.writeUInt16LE(32, entryOffset + 6);
    ico.writeUInt32LE(image.buffer.length, entryOffset + 8);
    ico.writeUInt32LE(imageOffset, entryOffset + 12);
    image.buffer.copy(ico, imageOffset);
    imageOffset += image.buffer.length;
  });

  return ico;
}

async function renderIcon(size, outputPath) {
  return sharp(Buffer.from(faviconSvg))
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

async function main() {
  await mkdir(ogDir, { recursive: true });

  await writeFile(path.join(publicDir, "favicon.svg"), faviconSvg, "utf8");

  await renderIcon(16, path.join(publicDir, "favicon-16x16.png"));
  await renderIcon(32, path.join(publicDir, "favicon-32x32.png"));
  await renderIcon(180, path.join(publicDir, "apple-touch-icon.png"));
  await renderIcon(192, path.join(publicDir, "android-chrome-192x192.png"));
  await renderIcon(512, path.join(publicDir, "android-chrome-512x512.png"));

  const icoPngs = await Promise.all(
    [16, 32, 48].map(async (size) => ({
      size,
      buffer: await sharp(Buffer.from(faviconSvg))
        .resize(size, size)
        .png({ compressionLevel: 9 })
        .toBuffer(),
    }))
  );
  await writeFile(path.join(publicDir, "favicon.ico"), createIco(icoPngs));

  await writeFile(
    path.join(publicDir, "site.webmanifest"),
    JSON.stringify(
      {
        name: "Hotel & Restaurant Waldschl\u00f6sschen",
        short_name: "Waldschl\u00f6sschen",
        description: "Boutique-Hotel, Restaurant und Eventlocation in der Saale-Unstrut Region.",
        lang: "de",
        start_url: "/de",
        scope: "/",
        display: "standalone",
        background_color: "#15120f",
        theme_color: "#15120f",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      null,
      2
    ) + "\n",
    "utf8"
  );

  const background = await sharp(path.join(publicDir, "restaurant_terrace_1920w.webp"))
    .resize(1200, 630, { fit: "cover", position: "center" })
    .modulate({ brightness: 0.9, saturation: 0.96 })
    .png()
    .toBuffer();

  await sharp(background)
    .composite([{ input: Buffer.from(previewOverlaySvg), left: 0, top: 0 }])
    .png({ compressionLevel: 9, palette: false })
    .toFile(path.join(ogDir, "waldschloesschen-preview.png"));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
