export const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' || 'https://harvest-and-co-showroom.vercel.app';