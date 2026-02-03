import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PoAttachmentService {
  /**
   * Deletes a PO attachment by ID
   * @param id The UUID of the attachment
   * @returns The deleted attachment record
   * @throws Error if not found
   */
  static async delete(id: string) {
    const attachment = await prisma.poAttachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      return null;
    }

    return await prisma.poAttachment.delete({
      where: { id },
    });
  }
}
