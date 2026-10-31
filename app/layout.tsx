import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Pixelify_Sans, VT323 } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/seo";
import "./globals.css";

const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["300", "400", "600"], variable: "--font-plex", display: "swap" });
const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel", display: "swap" });
const vt = VT323({ subsets: ["latin"], weight: "400", variable: "--font-vt", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Wasath Theekshana", url: SITE_URL }],
  creator: "Wasath Theekshana",
  publisher: "Wasath Theekshana",
  category: "technology",
  keywords: [
    "Wasath Theekshana",
    "DevOps engineer",
    "cloud infrastructure engineer",
    "Terraform",
    "Azure",
    "Kubernetes",
    "Sri Lanka",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    firstName: "Wasath",
    lastName: "Theekshana",
    username: "WasathTheekshana",
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  formatDetection: { telephone: false, email: false, address: false },
  // Set these in the host's env vars after adding the site to Search Console / Bing Webmaster Tools.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
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
