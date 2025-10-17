export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // 🔹 ฝั่ง client
    if (window.location.hostname === "localhost") {
      return "http://localhost:3000";
    }
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 🔹 กรณีรัน production local (เช่น next start)
  if (process.env.NODE_ENV === "production") {
    return "http://localhost:3000";
  }

  // 🔹 fallback ปกติ (development)
  return "http://localhost:3000";
};
