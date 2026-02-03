import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { PurchaseOrderView } from '@/types/purchase-order';
import api from '@/lib/api';

const B1010ViewMode: React.FC = () => {
  const { id = 'PO-220126-001' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PurchaseOrderView | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an actual API call: await api.get(`/purchase-orders/${id}`)
        // Mocking for the specific requirement
        const response = await api.get<PurchaseOrderView>(`/purchase-orders/${id}`);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch purchase order details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
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
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">B.10.10 View Mode</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Purchase Order Details: {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <Label className="text-muted-foreground">B-TC-074</Label>
              <p className="text-sm font-medium border-b pb-2 min-h-[2rem]">
                {data?.['b-tc-074'] || '-'}
              </p>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground">B-TC-075</Label>
              <p className="text-sm font-medium border-b pb-2 min-h-[2rem]">
                {data?.['b-tc-075'] || '-'}
              </p>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground">B-TC-076</Label>
              <p className="text-sm font-medium border-b pb-2 min-h-[2rem]">
                {data?.['b-tc-076'] || '-'}
              </p>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground">B-TC-077</Label>
              <p className="text-sm font-medium border-b pb-2 min-h-[2rem]">
                {data?.['b-tc-077'] || '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B1010ViewMode;