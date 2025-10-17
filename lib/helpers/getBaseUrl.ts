export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // 🔹 ฝั่ง client
    if (window.location.hostname === "localhost") {
      return "http://localhost:3000";
    }
    return window.location.origin;
  }

  // 🔹 ฝั่ง server (ตอน build / SSR)
  if (process.env.VERCEL_URL) {
    // ตัวนี้จะมีค่าเฉพาะตอน deploy บน Vercel
    return `https://${process.env.VERCEL_URL}`;
  }

  // 🔹 กรณีรัน production local (เช่น next start)
  if (process.env.NODE_ENV === "production") {
    return "http://localhost:3000";
  }

  // 🔹 fallback ปกติ (development)
  return "http://localhost:3000";
};
