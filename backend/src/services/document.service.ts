import { PrismaClient } from '@prisma/client';
import { DocumentUploadInput } from '../../../shared/validation/document.schema.js';

const prisma = new PrismaClient();

export class DocumentService {
  async createDocument(data: DocumentUploadInput, fileBuffer?: Buffer, fileName?: string) {
    // VR-026: Logic handles cases where document (fileBuffer) is null
    return await prisma.document.create({
      data: {
        title: data.title,
        description: data.description,
        filePath: fileName || null,
        hasAttachment: !!fileBuffer,
        createdAt: new Date(),
      },
    });
  }
}