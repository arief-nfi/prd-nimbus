import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nodeCreateSchema, NodeCreateInput } from '../../../shared/validation/node.schema';

export const useNodeForm = (defaultValues?: Partial<NodeCreateInput>) => {
  return useForm<NodeCreateInput>({
    resolver: zodResolver(nodeCreateSchema),
    defaultValues: {
      nodeType: '',
      nodeId: '',
      dpPercentage: null,
      ...defaultValues,
    },
    mode: 'onChange',
  });
};