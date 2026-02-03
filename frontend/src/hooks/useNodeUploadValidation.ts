import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nodeUploadSchema, NodeUploadInput } from '../../../shared/validation/node-upload.schema';

export const useNodeUploadForm = () => {
  return useForm<NodeUploadInput>({
    resolver: zodResolver(nodeUploadSchema),
    defaultValues: {
      nodeType: 'Warehouse',
      nodeId: ''
    },
    mode: 'onChange'
  });
};