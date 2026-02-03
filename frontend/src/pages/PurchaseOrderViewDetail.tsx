import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Printer, FileDown } from 'lucide-react';
import { PurchaseOrder } from '@/types/purchase-order';

const PurchaseOrderViewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPO = async () => {
      try {
        setLoading(true);
        // In production, this would be an actual API call
        // const response = await fetch(`/api/purchase-orders/${id}`);
        // const result = await response.json();
        
        // Mocking data for FR-047a
        setTimeout(() => {
          setData({
            id: 'PO-220126-001',
            poNumber: 'PO-220126-001',
            vendorName: 'Global Logistics Solutions',
            status: 'APPROVED',
            orderDate: '2023-10-26',
            deliveryDate: '2023-11-05',
            totalAmount: 12500.00,
            currency: 'USD',
            notes: 'Standard delivery terms apply. Handle with care.',
            items: [
              { id: '1', description: 'Server Rack 42U', quantity: 2, unitPrice: 5000, total: 10000 },
              { id: '2', description: 'Power Distribution Unit', quantity: 5, unitPrice: 500, total: 2500 }
            ]
          });
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to load purchase order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchPO();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight"># View Mode Behavior (B-FR-047a)</h1>
          <Badge variant={data.status === 'APPROVED' ? 'default' : 'secondary'}>
            {data.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>PO Information: {data.poNumber}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Vendor</label>
                <p className="text-base font-semibold">{data.vendorName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Order Date</label>
                <p className="text-base">{data.orderDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Expected Delivery</label>
                <p className="text-base">{data.deliveryDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                <p className="text-base font-bold">{data.currency} {data.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Line Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{data.currency} {item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{data.currency} {item.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground text-xs uppercase">Notes</label>
              <p className="text-sm mt-1 bg-muted p-3 rounded-md">{data.notes || 'No notes provided.'}</p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground italic">
                This view is read-only. To modify this purchase order, please contact your procurement administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseOrderViewDetail;