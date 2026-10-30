import "server-only";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { siteConfig } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

const INK = "#0B0B12";
const PLATE = "#15151F";
const LIME = "#C6FF3D";
const VIOLET = "#7C5CFF";
const FG = "#F5F4F0";
const MUTED = "#9A9AAE";

/** Google Font subset for exactly the characters drawn. Returns null offline so the image still renders. */
async function loadFont(spec: string, text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${spec}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = /src: url\((.+?)\) format\('(opentype|truetype)'\)/.exec(css)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

/** Satori can't decode WebP, so remote product cutouts are converted to PNG data URLs. */
async function toPngDataUrl(src: string) {
  try {
    const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
    const png = await sharp(buf).resize(560, 560, { fit: "inside" }).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 0.79} viewBox="0 0 100 79">
      <polygon fill={LIME} points="0,0 26.4,0 42.8,28.6 35.4,41.6 48.8,41.6 44.4,64.3 67.7,31.1 50.8,31.6 73.4,0 100,0 49.8,78.6" />
    </svg>
  );
}

export async function renderOg({
  title,
  subtitle,
  image,
  price,
}: {
  title: string;
  subtitle: string;
  image?: string;
  price?: string;
}) {
  const footer = "Demo store · no real payments";
  const [font, body, png] = await Promise.all([
    loadFont("Archivo:wdth,wght@125,800", `${siteConfig.name}${title}${price ?? ""}`),
    loadFont("Geist:wght@500", `${subtitle}${footer}`),
    image ? toPngDataUrl(image) : Promise.resolve(null),
  ]);

  // Body font first: it is the default for any text without an explicit fontFamily.
  // Offline, both are null and ImageResponse falls back to its built-in font.
  const fonts = [
    ...(body ? [{ name: "Geist", data: body, weight: 500 as const, style: "normal" as const }] : []),
    ...(font ? [{ name: "Archivo", data: font, weight: 800 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: INK,
          backgroundImage: `radial-gradient(circle at 88% 8%, ${VIOLET}66, transparent 45%), radial-gradient(circle at 6% 100%, ${LIME}26, transparent 40%)`,
          color: FG,
          padding: 64,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Mark size={56} />
            <span style={{ fontFamily: font ? "Archivo" : undefined, fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
              {siteConfig.name}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: png ? 600 : 960 }}>
            <span
              style={{
                fontFamily: font ? "Archivo" : undefined,
                fontSize: title.length > 26 ? 60 : 76,
                fontWeight: 800,
                lineHeight: 0.98,
                letterSpacing: -2,
              }}
            >
              {title}
            </span>
            <span style={{ fontSize: 28, color: MUTED }}>{subtitle}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {price && (
              <span
                style={{
                  background: LIME,
                  color: INK,
                  fontSize: 30,
                  fontWeight: 800,
                  padding: "10px 26px",
                  borderRadius: 999,
                  flexShrink: 0,
                  fontFamily: font ? "Archivo" : undefined,
                }}
              >
                {price}
              </span>
            )}
            <span style={{ fontSize: 22, color: MUTED, whiteSpace: "nowrap" }}>{footer}</span>
          </div>
        </div>
        {png && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 470,
              height: 470,
              alignSelf: "center",
              borderRadius: 999,
              background: PLATE,
              boxShadow: `0 0 120px ${VIOLET}55`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> */}
            <img src={png} width={360} height={360} style={{ objectFit: "contain" }} alt="" />
          </div>
        )}
      </div>
    ),
    {
      ...ogSize,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}
