// /app/api/upload-image/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const form = new IncomingForm();

  // Convert the Next.js Request to a Node.js IncomingMessage
  const stream = require('stream');
  const buffer = await req.arrayBuffer();
  const readable = new stream.Readable();
  readable._read = () => {};
  readable.push(Buffer.from(buffer));
  readable.push(null);

  // Copy headers for formidable to parse correctly
  readable.headers = Object.fromEntries(req.headers.entries());

  const data = await new Promise((resolve, reject) => {
    form.parse(readable, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const file = (data as any).files.file[0];
  const result = await cloudinary.uploader.upload(file.filepath, {
    folder: 'plant_pot_images',
  });

  return NextResponse.json({ url: result.secure_url, public_id: result.public_id });
}
