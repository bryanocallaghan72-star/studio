/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
   webpack: (config, { isServer }) => {
    // This is the correct way to prevent server-only modules from being bundled on the client.
    if (!isServer) {
      config.externals = [
        ...(config.externals || []),
        // The following modules are dependencies of genkit's tracing system and are not needed on the client.
        '@grpc/grpc-js', 
        'node-pty'
      ];
    }

    return config;
  },
  // Ensure the Google Maps API key is available to the browser.
  // This maps the non-prefixed GOOGLE_MAPS_API_KEY (often used for secrets) 
  // to the NEXT_PUBLIC_ version required by client components.
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || "",
  }
};

module.exports = nextConfig;
