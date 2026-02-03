import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentUploadSchema, DocumentUploadInput } from '../../../shared/validation/document.schema';

export const useDocumentForm = () => {
  return useForm<DocumentUploadInput>({
    resolver: zodResolver(DocumentUploadSchema),
    defaultValues: {
      title: '',
      description: '',
      document: undefined,
    },
    mode: 'onSubmit',
  });
};