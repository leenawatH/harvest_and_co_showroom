import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const path = url.searchParams.get('folderName');
  console.log('Path to delete:', path);

  if (!path) {
    return NextResponse.json({ error: 'Missing folderName parameter' }, { status: 400 });
  }

  try {
    // 1. ลบไฟล์ทั้งหมดในโฟลเดอร์
    const { error: error1 } = await cloudinary.api.delete_resources_by_prefix(path + '/', {
      resource_type: 'image',
      type: 'upload',
      invalidate: true,
    });

    if (error1) {
      return NextResponse.json({ error: error1.message }, { status: 400 });
    }

    // 2. ลบโฟลเดอร์
    const { error: error2 } = await cloudinary.api.delete_folder(path, {
      invalidate: true,
    });

    // ✅ ถ้า error2 เป็น 404 (ไม่เจอ folder) → ให้ถือว่า success ไปเลย
    if (error2) {
      if (
        error2.http_code === 404 &&
        typeof error2.message === 'string' &&
        error2.message.includes("Can't find folder")
      ) {
        console.warn(`Folder not found: ${path} → continuing as success`);
      } else {
        return NextResponse.json({ error: error2.message }, { status: 400 });
      }
    }

    console.log('All files and the folder have been deleted successfully.');
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Cloudinary deletion error:', error);

    // ✅ ตรวจว่าเป็น error 404 จากข้อความ Can't find folder แล้ว return success ได้เลย
    const isNotFound =
      error?.error?.message?.includes("Can't find folder") ||
      error?.message?.includes("Can't find folder");

    const is404 =
      error?.error?.http_code === 404 || error?.http_code === 404;

    if (isNotFound && is404) {
      console.warn(`Folder not found, ignoring error: ${path}`);
      return NextResponse.json({ success: true });
    }

    // ถ้าไม่ใช่ 404 ก็ return error ตามปกติ
    const errorMessage =
      error?.error?.message || error?.message || 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
