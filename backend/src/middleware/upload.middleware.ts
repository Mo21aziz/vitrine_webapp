import multer from "multer";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

// Kept in memory so the service can check the real file type before anything touches the disk
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
}).single("image");
