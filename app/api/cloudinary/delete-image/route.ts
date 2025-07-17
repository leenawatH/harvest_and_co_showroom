import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const public_id = url.searchParams.get('public_id');  // ดึงค่าจาก query parameter
  if (!public_id) {
    return NextResponse.json({ error: 'public_id is required' }, { status: 400 });
  }

  try {
    // ลบรูปจาก Cloudinary โดยใช้ public_id
    const result = await cloudinary.uploader.destroy(public_id);

    // ตรวจสอบว่าได้รับผลลัพธ์ที่สำเร็จหรือไม่
    if (result.result === 'ok') {
      return NextResponse.json({ message: 'Image deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }
  } catch (err) {
    console.error('Error deleting image:', err);
    return NextResponse.json({ error: 'Error deleting image' }, { status: 500 });
  }
}
