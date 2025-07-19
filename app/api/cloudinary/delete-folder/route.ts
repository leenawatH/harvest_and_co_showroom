import { v2 as cloudinary } from 'cloudinary';
import { NextResponse, NextRequest } from 'next/server';

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
      resource_type: 'image', // หรือ 'video' ถ้าต้องการลบไฟล์ประเภทอื่น
      type: 'upload', // กำหนดประเภทของการอัปโหลด
      invalidate: true, // ล้างแคช CDN สำหรับไฟล์ที่ถูกลบ
    });

    if (error1) {
      return NextResponse.json({ error: error1.message }, { status: 400 });
    }

    // 2. ลบโฟลเดอร์ (ถ้ามี) หลังจากลบไฟล์ทั้งหมดแล้ว
    const { error: error2 } = await cloudinary.api.delete_folder(path, {
      invalidate: true, // ล้างแคช CDN ของโฟลเดอร์
    });

    if (error2) {
      return NextResponse.json({ error: error2.message }, { status: 400 });
    }

    console.log('All files and the folder have been deleted successfully.');

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


