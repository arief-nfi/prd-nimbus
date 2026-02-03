import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Uom } from '@/types/uom';

const uomSchema = z.object({
  uom_id: z.string().min(1, 'UOM ID is required'),
  uom_code: z.string().min(1, 'UOM Code is required'),
  uom_name: z.string().min(1, 'UOM Name is required'),
  description: z.string().optional().nullable(),
});

type UomFormValues = z.infer<typeof uomSchema>;

const ViewModeBehaviorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Uom | null>(null);

  const {
    register,
    reset,
    formState: { errors },
  } = useForm<UomFormValues>({
    resolver: zodResolver(uomSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    const fetchUomDetail = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be an API call: /api/uom/${id}
        // Mocking the behavior for the specific FR-013 requirements
        const response = await fetch(`/api/uom/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch UOM details');
        }
        const result = await response.json();
        setData(result);
        reset(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUomDetail();
    } else {
      setLoading(false);
    }
  }, [id, reset]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold"># View Mode Behavior (A-FR-013a)</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>UOM Detail Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="uom_id">UOM ID <span className="text-destructive">*</span></Label>
              <Input
                id="uom_id"
                {...register('uom_id')}
                readOnly
                className="bg-muted"
              />
              {errors.uom_id && (
                <p className="text-sm text-destructive">{errors.uom_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="uom_code">UOM Code <span className="text-destructive">*</span></Label>
              <Input
                id="uom_code"
                {...register('uom_code')}
                readOnly
                className="bg-muted"
              />
              {errors.uom_code && (
                <p className="text-sm text-destructive">{errors.uom_code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="uom_name">UOM Name <span className="text-destructive">*</span></Label>
              <Input
                id="uom_name"
                {...register('uom_name')}
                readOnly
                className="bg-muted"
              />
              {errors.uom_name && (
                <p className="text-sm text-destructive">{errors.uom_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...register('description')}
                readOnly
                className="bg-muted"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewModeBehaviorDetail;