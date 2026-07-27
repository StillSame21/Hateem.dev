import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The homepage prerenders statically. We deliberately do not use
  // `output: "export"` because /api/contact needs a server runtime on Vercel,
  // and because the header below needs a server to run.
  reactStrictMode: true,

  // Force the résumé PDF to download rather than open in the browser's own
  // PDF viewer — that inline render is what mangled a Word export's fonts
  // and layout. `/resume` (see src/app/resume/page.tsx) is the canonical,
  // correctly-rendered version; this file is the download-only fallback.
  async headers() {
    return [
      {
        source: "/resume.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Mohamad-Hateem-Nazamid-Resume.pdf"',
          },
        ],
      },
      // Demo clips only ever load on click (see ProjectShots.tsx), so a
      // repeat visitor who plays one twice should never re-fetch it. The
      // filename is the version — re-encoding a clip means renaming it, not
      // overwriting it in place, or a cached visitor keeps the stale bytes.
      {
        source: "/shots/:file*.mp4",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
