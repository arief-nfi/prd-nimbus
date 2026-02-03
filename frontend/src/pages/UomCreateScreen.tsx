import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const uomSchema = z.object({
  uom_id: z.string().min(1, 'UOM ID is required').max(10, 'UOM ID too long'),
  uom_code: z.string().min(1, 'UOM Code is required'),
  uom_name: z.string().min(1, 'UOM Name is required'),
  description: z.string().optional(),
  status: z.enum(['Active', 'Inactive'], {
    required_error: 'Status is required',
  }),
});

type UomFormValues = z.infer<typeof uomSchema>;

const UomCreateScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UomFormValues>({
    resolver: zodResolver(uomSchema),
    defaultValues: {
      status: 'Active',
      uom_id: '',
    },
  });

  const currentStatus = watch('status');

  // Simulate ID Generation on Mount (VR-012/VR-013 logic)
  useEffect(() => {
    const generateId = async () => {
      try {
        // In production, this would be an API call to get the next sequence
        const mockSequence = '001';
        setValue('uom_id', `UOM${mockSequence}`);
      } catch (err) {
        setServerError('Maximum sequence reached for UOM. Contact administrator.');
      }
    };
    generateId();
  }, [setValue]);

  const onSubmit = async (data: UomFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const response = await fetch('/api/uoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          throw new Error('Name must be unique');
        }
        throw new Error(errorData.message || 'Failed to create UOM');
      }

      toast({
        title: 'Success',
        description: 'UOM created successfully',
      });
      navigate('/a77-uom-list'); // Assuming a list view exists
    } catch (err: any) {
      setServerError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">A.7.7 UOM Create Screen</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="uom_id">
                  UOM ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="uom_id"
                  {...register('uom_id')}
                  placeholder="e.g. UOM001"
                  readOnly
                  className="bg-muted"
                />
                {errors.uom_id && (
                  <p className="text-sm text-red-500">{errors.uom_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="uom_code">
                  UOM Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="uom_code"
                  {...register('uom_code')}
                  placeholder="e.g. PCS"
                />
                {errors.uom_code && (
                  <p className="text-sm text-red-500">{errors.uom_code.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="uom_name">
                UOM Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="uom_name"
                {...register('uom_name')}
                placeholder="e.g. Pieces"
              />
              {errors.uom_name && (
                <p className="text-sm text-red-500">{errors.uom_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter UOM description..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue('status', value as 'Active' | 'Inactive')}
                defaultValue={currentStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UomCreateScreen;