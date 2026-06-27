import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MrVayn, Founder & Game Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded OG/social card (OVERDRIVE palette). Generated at the edge, no asset.
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
          background: "#07090F",
          color: "#EAF0FF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#FF2D6B", fontSize: 28, letterSpacing: 6 }}>
          <div style={{ width: 18, height: 18, background: "#FF2D6B" }} />
          FOUNDER & GAME DEVELOPER
        </div>
        <div style={{ fontSize: 168, fontWeight: 900, lineHeight: 1, marginTop: 20, letterSpacing: -2 }}>MRVAYN</div>
        <div style={{ fontSize: 34, color: "#8A94A7", marginTop: 24 }}>
          Unreal Engine 5 · Niagara VFX · Multiplayer · Gameplay systems
        </div>
        <div
          style={{
            marginTop: "auto",
            width: "100%",
            height: 10,
            background: "linear-gradient(90deg,#FF2D6B,#B26BFF,#19E0FF)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
