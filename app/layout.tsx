import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Pixelify_Sans, VT323 } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["300", "400", "600"], variable: "--font-plex", display: "swap" });
const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel", display: "swap" });
const vt = VT323({ subsets: ["latin"], weight: "400", variable: "--font-vt", display: "swap" });

const SITE = "https://wasath.site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Wasath's Terminal · DevOps & Cloud Engineer",
  description:
    "Interactive terminal portfolio of Wasath Theekshana: DevOps & Cloud Infrastructure Engineer from Sri Lanka. Terraform, Azure, Kubernetes, Go and TypeScript.",
  authors: [{ name: "Wasath Theekshana", url: SITE }],
  keywords: ["Wasath Theekshana", "DevOps", "Terraform", "Azure", "Kubernetes", "Sri Lanka", "portfolio"],
  icons: { icon: "/logo.png" },
  openGraph: {
    title: "Wasath's Terminal",
    description: "DevOps & Cloud Infrastructure Engineer. Type `help` to explore.",
    url: SITE,
    siteName: "Wasath's Terminal",
    images: [{ url: "/banner.png" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Wasath's Terminal", images: ["/banner.png"] },
};

export const viewport: Viewport = {
  themeColor: "#04020e",
  width: "device-width",
  initialScale: 1,
};

// Applies the saved theme before first paint to avoid a colour flash.
const THEME_BOOT = `try{var t=localStorage.getItem("wt-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="amber" className={`${plex.variable} ${pixel.variable} ${vt.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
