import type { NextConfig } from "next";

const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : "cqtgzjypvvhtfvhjxxqb.supabase.co";
  } catch {
    return "cqtgzjypvvhtfvhjxxqb.supabase.co";
  }
})();

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so a stray lockfile elsewhere on the
  // machine can't make Next infer the wrong root (no-op on Vercel).
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
