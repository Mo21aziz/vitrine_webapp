import { randomUUID } from "node:crypto";
import { prisma } from "../config/prisma.js";
import { HttpError } from "../types/http-error.js";

export const UPLOAD_URL_PREFIX = "/uploads/";
export const UPLOAD_FILENAME = /^[a-f0-9-]{36}\.(jpg|png|webp)$/;

const MIME = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" } as const;
type Ext = keyof typeof MIME;

/** Detect the real image type from the file's first bytes (never trust the client's mimetype). */
function detectExtension(buf: Buffer): Ext | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "png";
  }
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    return "webp";
  }
  return null;
}

/**
 * Photos are stored in the database (not on disk) so they survive redeploys on hosts
 * with an ephemeral filesystem such as Render's free plan. URLs stay "/uploads/<uuid>.<ext>".
 */
export const uploadService = {
  async saveImage(buffer: Buffer) {
    const ext = detectExtension(buffer);
    if (!ext) throw new HttpError(400, "Format non supporté : utilisez une image JPG, PNG ou WebP");

    const id = `${randomUUID()}.${ext}`;
    await prisma.image.create({
      data: { id, mimeType: MIME[ext], size: buffer.length, data: new Uint8Array(buffer) },
    });
    return { url: `${UPLOAD_URL_PREFIX}${id}` };
  },

  async getImage(filename: string) {
    if (!UPLOAD_FILENAME.test(filename)) return null;
    return prisma.image.findUnique({ where: { id: filename }, select: { mimeType: true, data: true } });
  },

  /** Remove a previously uploaded image. Ignores anything that isn't one of our files. */
  async deleteImage(url: string | null | undefined) {
    if (!url?.startsWith(UPLOAD_URL_PREFIX)) return;
    const id = url.slice(UPLOAD_URL_PREFIX.length);
    if (!UPLOAD_FILENAME.test(id)) return;
    await prisma.image.deleteMany({ where: { id } });
  },
};
