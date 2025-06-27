import React, { useState } from "react";

// ตั้งค่าตาม Cloudinary ของคุณ
const CLOUD_NAME = "dtppo2rxs"; // TODO: เปลี่ยนเป็น cloud name จริง
const UPLOAD_PRESET = "my_unsigned_preset"; // TODO: เปลี่ยนเป็น unsigned upload preset จริง

export default function CloudinaryImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setImageUrl(null);
    if (!file) {
      setError("กรุณาเลือกไฟล์");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    if (folder) {
      formData.append("folder", folder);
    }
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
      } else {
        setError(data.error?.message || "อัปโหลดไม่สำเร็จ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col gap-4 max-w-md p-4 border rounded">
      <label className="font-medium">เลือกไฟล์รูปภาพ</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <label className="font-medium">โฟลเดอร์ (Cloudinary)</label>
      <input
        type="text"
        value={folder}
        onChange={e => setFolder(e.target.value)}
        placeholder="เช่น product-images/"
        className="border px-2 py-1 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "กำลังอัปโหลด..." : "อัปโหลด"}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {imageUrl && (
        <div className="flex flex-col gap-2">
          <span className="text-green-600">อัปโหลดสำเร็จ!</span>
          <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
            {imageUrl}
          </a>
          <img src={imageUrl} alt="uploaded" className="max-w-xs mt-2 rounded" />
        </div>
      )}
    </form>
  );
}
