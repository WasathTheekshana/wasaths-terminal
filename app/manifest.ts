import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Wasath",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#04020e",
    theme_color: "#04020e",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
