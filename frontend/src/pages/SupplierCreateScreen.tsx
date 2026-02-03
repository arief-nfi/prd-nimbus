import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { SupplierStatus } from '@/types/supplier';

const supplierSchema = z.object({
  supp_id: z.string().min(1, 'Supp ID is required'),
  supplier_name: z.string().min(1, 'Supplier Name is required'),
  pic_supplier_name: z.string().min(1, 'PIC Supplier Name is required'),
  alamat: z.string().min(1, 'Address is required'),
  phone_number: z.string()
    .min(8, 'Phone Number must be at least 8 digits')
    .max(15, 'Phone Number must not exceed 15 digits')
    .regex(/^[1-9][0-9]{7,14}$/, 'Phone Number must be 8-15 digits and cannot start with 0'),
  description: z.string().optional(),
  status: z.nativeEnum(SupplierStatus, {
    errorMap: () => ({ message: 'Status is required' }),
  }),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

const SupplierCreateScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      status: SupplierStatus.ACTIVE,
    },
  });

  const currentStatus = watch('status');

  const onSubmit = async (data: SupplierFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to create supplier');
      }

      navigate('/suppliers');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">A.7.3 Supplier Create Screen</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="supplier-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supp_id">
                  Supp ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="supp_id"
                  {...register('supp_id')}
                  placeholder="e.g. SUP0001"
                  className={errors.supp_id ? 'border-red-500' : ''}
                />
                {errors.supp_id && <p className="text-xs text-red-500">{errors.supp_id.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier_name">
                  Supplier Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="supplier_name"
                  {...register('supplier_name')}
                  placeholder="Enter supplier name"
                  className={errors.supplier_name ? 'border-red-500' : ''}
                />
                {errors.supplier_name && <p className="text-xs text-red-500">{errors.supplier_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pic_supplier_name">
                  PIC Supplier Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pic_supplier_name"
                  {...register('pic_supplier_name')}
                  placeholder="Enter PIC name"
                  className={errors.pic_supplier_name ? 'border-red-500' : ''}
                />
                {errors.pic_supplier_name && <p className="text-xs text-red-500">{errors.pic_supplier_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat">
                  Alamat <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="alamat"
                  {...register('alamat')}
                  placeholder="Enter full address"
                  className={errors.alamat ? 'border-red-500' : ''}
                />
                {errors.alamat && <p className="text-xs text-red-500">{errors.alamat.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone_number"
                  {...register('phone_number')}
                  placeholder="e.g. 8123456789"
                  className={errors.phone_number ? 'border-red-500' : ''}
                />
                {errors.phone_number && <p className="text-xs text-red-500">{errors.phone_number.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Optional description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue('status', value as SupplierStatus)}
                  defaultValue={currentStatus}
                >
                  <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SupplierStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={SupplierStatus.INACTIVE}>Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="supplier-form"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SupplierCreateScreen;