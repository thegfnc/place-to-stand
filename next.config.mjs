import { withBotId } from 'botid/next/config'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const projectRoot = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  turbopack: {
    root: projectRoot,
  },
  // react-pdf reads the referral PDF's fonts from disk at request time; make
  // sure the files ship inside that function's bundle on Vercel.
  outputFileTracingIncludes: {
    '/referral/pdf': ['./public/fonts/**/*'],
    // The social share image reads the same fonts.
    '/opengraph-image': ['./public/fonts/**/*'],
    '/twitter-image': ['./public/fonts/**/*'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default withBotId(nextConfig)
