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
    ];
  },
};

export default nextConfig;
