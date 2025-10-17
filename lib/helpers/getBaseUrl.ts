export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // ✅ ฝั่ง client: ใช้ relative path เช่น /api/plant
    return "";
  }

  // ✅ ฝั่ง server (SSR หรือตอน build)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // ✅ บน Vercel (เผื่อ NEXT_PUBLIC_API_URL ไม่มี)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // ✅ fallback สำหรับ local (เช่น npm run dev)
  return "https://localhost:3000";
};
