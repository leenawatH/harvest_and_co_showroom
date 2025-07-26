import { getBaseUrl } from '@/lib/helpers/getBaseUrl';

//Upload file to cloudinary
export async function uploadImage(file: File, path: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', path);

  const res = await fetch(`${getBaseUrl()}/api/cloudinary/upload-image`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data;
}

// Delete image from cloudinary
export async function deleteImage(publicId: string) {
  const res = await fetch(`${getBaseUrl()}/api/cloudinary/delete-image?public_id=${publicId}`, {
    method: 'DELETE',
  });

  const data = await res.json();
  if (res.ok) {
    console.log('Image deleted successfully:', data);
  } else {
    console.error('Error deleting image:', data.error);
  }
}   

//Delete folder from cloudinary
export async function deleteFolder(folderName: string) {
  console.log('Deleting folder:', folderName);
  const res = await fetch(`${getBaseUrl()}/api/cloudinary/delete-folder?folderName=${folderName}`, {
    method: 'DELETE',
  });
  const data = await res.json();
if (res.ok) {
    console.log('Folder deleted successfully:', data);
  } else {
    console.error('Error deleting folder:', data.error);
  }
}


