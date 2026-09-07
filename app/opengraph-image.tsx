import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MrVayn | Unreal Engine & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded OG/social card in the v4 light-glass palette (off-white page, ink text,
// red slab). Edge-generated, no asset.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#F0F2F6",
          color: "#0B0E14",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#0B0E14", fontSize: 26, letterSpacing: 6 }}>
          <div style={{ width: 18, height: 18, background: "#E8112D" }} />
          UNREAL ENGINE & FULL-STACK DEVELOPER
        </div>
        <div style={{ color: "#0B0E14", fontSize: 168, fontWeight: 900, lineHeight: 1, marginTop: 20, letterSpacing: -2 }}>MRVAYN</div>
        <div style={{ width: 240, height: 10, background: "#E8112D", marginTop: 18 }} />
        <div style={{ fontSize: 32, color: "#3E4652", marginTop: 28 }}>
          Unreal Engine 5 · Niagara VFX · Multiplayer · Next.js · TypeScript
        </div>
        <div style={{ marginTop: "auto", width: "100%", height: 2, background: "#CDD2DC" }} />
      </div>
    ),
    { ...size },
  );
}
