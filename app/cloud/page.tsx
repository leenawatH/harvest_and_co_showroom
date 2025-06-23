// components/UploadButton.tsx
"use client";
import { CldUploadButton } from "next-cloudinary";

function UploadButton() {
    return (
        <div className="p-4 h-screen flex items-center justify-center">
            <CldUploadButton
                uploadPreset="my_unsigned_preset"
                options={{
                    folder: "my-nextjs-uploads/specific-folder",
                    sources: ["local"],
                    multiple: false,
                }}
            />
        </div>
    );
}

export default UploadButton;
