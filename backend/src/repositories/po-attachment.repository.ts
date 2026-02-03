import { PrismaClient, PoAttachment, Prisma } from '@prisma/client';

export class PoAttachmentRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<PoAttachment | null> {
    return this.prisma.poAttachment.findUnique({
      where: { id },
    });
  }

  async findByPoId(poId: string): Promise<PoAttachment[]> {
    return this.prisma.poAttachment.findMany({
      where: { poId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.PoAttachmentCreateInput, tx?: Prisma.TransactionClient): Promise<PoAttachment> {
    const client = tx || this.prisma;
    return client.poAttachment.create({ data });
  }

  async update(id: string, data: Prisma.PoAttachmentUpdateInput, tx?: Prisma.TransactionClient): Promise<PoAttachment> {
    const client = tx || this.prisma;
    return client.poAttachment.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient): Promise<PoAttachment> {
    const client = tx || this.prisma;
    return client.poAttachment.delete({
      where: { id },
    });
  }

  async deleteManyByPoId(poId: string, tx?: Prisma.TransactionClient): Promise<Prisma.BatchPayload> {
    const client = tx || this.prisma;
    return client.poAttachment.deleteMany({
      where: { poId },
    });
  }
}