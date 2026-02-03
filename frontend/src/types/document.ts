export interface DocumentUploadResponse {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: string;
}

export interface DocumentUploadForm {
  file: FileList;
  description?: string;
}