import { ImageResponse } from "next/og";

export const alt = "Wasath Theekshana, DevOps & Cloud Infrastructure Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#04020e",
          border: "10px solid #f1c42c",
          padding: "48px 56px",
          color: "#f8ebdd",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", color: "#f1c42c", fontSize: 28 }}>
          <span>Wasath.x64_x86</span>
          <span>wasath.site</span>
        </div>
        <div style={{ display: "flex", fontSize: 190, fontWeight: 800, letterSpacing: 18, color: "#e46a18", lineHeight: 1 }}>
          WASATH
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 44, color: "#f8ebdd" }}>DevOps &amp; Cloud Infrastructure Engineer</div>
          <div style={{ fontSize: 28, color: "#8d8478" }}>Terraform · Azure · Kubernetes · Go · TypeScript</div>
          <div style={{ fontSize: 28, color: "#fd9bdb" }}>guest@WasathTheekshana:$ ~ help_</div>
        </div>
      </div>
    ),
    size,
  );
}
