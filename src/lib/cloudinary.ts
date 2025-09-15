import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export async function uploadBuffer(buffer: Buffer, folder?: string) {
  return new Promise<{
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
  }>((resolve, reject) => {
    const options: Record<string, any> = {};
    if (folder) options.folder = folder;

    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err || !result) return reject(err || new Error("No result"));
      resolve({
        public_id: result.public_id,
        secure_url: result.secure_url!,
        width: result.width!,
        height: result.height!,
      });
    });
    stream.end(buffer);
  });
}

export async function destroyPublicId(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    // log and continue in dev
    console.warn("Cloudinary destroy error", e);
  }
}
