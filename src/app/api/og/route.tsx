import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title =
    searchParams.get("title") ?? "Firma Digital para Latinoamérica";
  const fontSize = title.length > 60 ? 44 : title.length > 40 ? 52 : 60;

  const countries = [
    "México",
    "Colombia",
    "Argentina",
    "Chile",
    "Perú",
    "Costa Rica",
    "+12 países",
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #1a3c5e 0%, #0d2440 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top bar: logo + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                background: "#F97316",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "26px",
                  fontWeight: "800",
                }}
              >
                F
              </span>
            </div>
            <span
              style={{
                color: "white",
                fontSize: "30px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
              }}
            >
              Firmiu
            </span>
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "18px",
              letterSpacing: "0.5px",
            }}
          >
            firmiu.com
          </span>
        </div>

        {/* Middle: title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            flex: 1,
            justifyContent: "center",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#F97316",
              }}
            />
            <span
              style={{
                color: "#F97316",
                fontSize: "16px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Firma Electrónica · Legal en LATAM
            </span>
          </div>
          <div
            style={{
              color: "white",
              fontSize: `${fontSize}px`,
              fontWeight: "800",
              lineHeight: "1.1",
              letterSpacing: "-1.5px",
              maxWidth: "950px",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: country badges */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "nowrap" }}>
          {countries.map((country) => (
            <div
              key={country}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: "100px",
                padding: "6px 14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#F97316",
                }}
              />
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                }}
              >
                {country}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
