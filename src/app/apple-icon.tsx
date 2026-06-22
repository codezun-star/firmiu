import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon — iOS applies its own rounded mask, so we fill the full
// square with the brand navy and center the "F" mark.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a3c5e 0%, #0d2440 100%)",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span style={{ fontSize: 112, fontWeight: 800, color: "#ffffff" }}>F</span>
        <div
          style={{
            position: "absolute",
            bottom: 44,
            right: 50,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#F97316",
          }}
        />
      </div>
    ),
    size
  );
}
