import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, sans-serif", backgroundColor: "#F8F9FA" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <header style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1rem 1.5rem", borderBottom: "1px solid #E5E7EB", backgroundColor: "white",
          }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <p style={{ fontSize: "1.25rem", fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>
                <span style={{ color: "#1a3c5e" }}>firm</span>
                <span style={{ color: "#F97316" }}>iu</span>
              </p>
            </Link>
          </header>

          {/* Main */}
          <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <div style={{ textAlign: "center", maxWidth: 400 }}>
              <p style={{ fontSize: "clamp(80px,15vw,128px)", fontWeight: 700, lineHeight: 1, margin: "0 0 1.5rem" }}>
                <span style={{ color: "#1a3c5e" }}>4</span>
                <span style={{ color: "#F97316" }}>0</span>
                <span style={{ color: "#1a3c5e" }}>4</span>
              </p>
              <h1 style={{ fontSize: "1.375rem", fontWeight: 600, color: "#111827", marginBottom: "0.75rem" }}>
                Página no encontrada
              </h1>
              <p style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.6, marginBottom: "2rem" }}>
                Lo que buscás no existe o fue movido a otro lugar.
              </p>
              <Link
                href="/"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  backgroundColor: "#F97316", color: "white", textDecoration: "none",
                  fontSize: "0.875rem", fontWeight: 500, padding: "0.625rem 1.5rem",
                  borderRadius: 9, transition: "background-color 0.15s",
                }}
              >
                Volver al inicio
              </Link>
            </div>
          </main>

          {/* Footer */}
          <footer style={{ padding: "1.25rem", textAlign: "center", borderTop: "1px solid #E5E7EB" }}>
            <p style={{ fontSize: "0.75rem", color: "#9CA3AF", margin: 0 }}>
              © {new Date().getFullYear()}{" "}
              <span style={{ color: "#1a3c5e", fontWeight: 500 }}>firm</span>
              <span style={{ color: "#F97316", fontWeight: 500 }}>iu</span>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
