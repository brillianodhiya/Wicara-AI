import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wicara AI",
    short_name: "Wicara",
    description:
      "Transcribe, analyze, and transform your meetings with AI-powered tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#2C444C",
    theme_color: "#0474C4",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
