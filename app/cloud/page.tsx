"use client";
import CloudinaryImageUpload from "@/components/AdminDashboard/CloudinaryImageUpload";
import { useState } from "react";

function UploadButton() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <div className="p-4 h-screen flex flex-col items-center justify-center gap-4">
      <CloudinaryImageUpload
      />

   </div>  
  );
}

export default UploadButton;
