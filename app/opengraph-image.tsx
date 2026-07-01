import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MrVayn | Unreal Engine & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded OG/social card in the default "Ghost" (mono) palette. Edge-generated, no asset.
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
          background: "#08090C",
          color: "#ECF0F8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#E2E8F4", fontSize: 26, letterSpacing: 6 }}>
          <div style={{ width: 18, height: 18, background: "#E2E8F4" }} />
          UNREAL ENGINE & FULL-STACK DEVELOPER
        </div>
        <div style={{ fontSize: 168, fontWeight: 900, lineHeight: 1, marginTop: 20, letterSpacing: -2 }}>MRVAYN</div>
        <div style={{ fontSize: 32, color: "#8C929E", marginTop: 24 }}>
          Unreal Engine 5 · Niagara VFX · Multiplayer · Next.js · TypeScript
        </div>
        <div
          style={{
            marginTop: "auto",
            width: "100%",
            height: 10,
            background: "linear-gradient(90deg,#E2E8F4,#96A0B4,#3A404C)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
