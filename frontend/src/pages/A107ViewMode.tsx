import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock, Calendar, ClipboardList, User, DollarSign, AlertCircle, ArrowLeft } from 'lucide-react';
import { PurchaseOrder } from '@/types/purchase-order';

const poSchema = z.object({
  poDate: z.string().min(1, 'PO Date is required'),
});

type POFormValues = z.infer<typeof poSchema>;

const A107ViewMode: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PurchaseOrder | null>(null);

  const form = useForm<POFormValues>({
    resolver: zodResolver(poSchema),
    defaultValues: {
      poDate: '',
    },
  });

  useEffect(() => {
    const fetchPO = async () => {
      try {
        setLoading(true);
        // Mocking API call for FR-005 scenario
        // In a real app, replace with: const response = await api.get(`/purchase-orders/${id}`);
        const mockData: PurchaseOrder = {
          id: id || 'PO-2026-001',
          poNumber: 'PO-2026-001',
          poDate: '2026-01-22',
          status: 'LOCKED',
          vendorName: 'Global Supplies Inc.',
          totalAmount: 15400.00,
          description: 'Standard inventory replenishment',
          createdAt: '2026-01-22T08:00:00Z',
          updatedAt: '2026-01-22T09:30:00Z',
        };
        
        setData(mockData);
        form.reset({ poDate: mockData.poDate });
      } catch (err) {
        setError('Failed to load Purchase Order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPO();
  }, [id, form]);

  const onSubmit = (values: POFormValues) => {
    // Implementation logic for FR-005: PO Date remains locked regardless of attempt to change
    console.log('Submission attempted with:', values);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center mb-6 gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">A.10.7 View Mode</h1>
          <p className="text-muted-foreground">Purchase Order Detail View</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">{data?.poNumber}</CardTitle>
              <CardDescription>Created on {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
              <Lock className="mr-1 h-3 w-3" /> {data?.status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" /> 
                      PO Date
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...form.register('poDate')} 
                        type="date" 
                        disabled 
                        className="bg-slate-50 cursor-not-allowed"
                      />
                    </FormControl>
                    <p className="text-[0.8rem] text-muted-foreground">
                      PO Date is locked and cannot be modified after submission (FR-005).
                    </p>
                  </FormItem>

                  <div className="space-y-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Vendor
                    </span>
                    <div className="p-2 border rounded-md bg-slate-50">{data?.vendorName}</div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      Total Amount
                    </span>
                    <div className="p-2 border rounded-md bg-slate-50 font-mono">
                      ${data?.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      Description
                    </span>
                    <div className="p-2 border rounded-md bg-slate-50 min-h-[40px]">
                      {data?.description || 'No description provided'}
                    </div>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Read Only Mode</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    This Purchase Order was submitted on 22/01/2026. Per business rules (FR-005), 
                    the PO Date and associated fields are now locked and cannot be changed.
                  </AlertDescription>
                </Alert>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default A107ViewMode;