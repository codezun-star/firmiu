import { ImageResponse } from "next/og";

export const runtime = "edge";

// Square brand mark used by JSON-LD (schema.org Organization logo) and the PWA
// manifest. Returns a real 512×512 PNG so search engines can validate the logo.
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "512px",
          height: "512px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a3c5e 0%, #0d2440 100%)",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span style={{ fontSize: 320, fontWeight: 800, color: "#ffffff" }}>F</span>
        <div
          style={{
            position: "absolute",
            bottom: 124,
            right: 140,
            width: 62,
            height: 62,
            borderRadius: "50%",
            background: "#F97316",
          }}
        />
      </div>
    ),
    { width: 512, height: 512 }
  );
}
