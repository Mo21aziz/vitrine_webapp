import { prisma } from "../config/prisma.js";

export const adminRepository = {
  findByUsername(username: string) {
    return prisma.admin.findUnique({ where: { username } });
  },

  findById(id: number) {
    return prisma.admin.findUnique({ where: { id }, select: { id: true, username: true } });
  },
};
