import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  ArrowLeft, 
  Package, 
  Warehouse, 
  Hash, 
  Calendar, 
  FileText 
} from 'lucide-react';
import { Inventory } from '@/types/inventory';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const InventoryDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Inventory | null>(null);

  useEffect(() => {
    const fetchInventoryDetail = async () => {
      try {
        setLoading(true);
        // In production, replace with actual API call: fetch(`/api/inventory/${id}`)
        const response = await fetch(`/api/inventory/${id}`);
        if (!response.ok) throw new Error('Failed to fetch inventory details');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load inventory details.',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInventoryDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-destructive">Error Loading Data</h2>
        <p className="text-muted-foreground">{error || 'Inventory record not found.'}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">A.10.9 Inventory View</h1>
        </div>
        <Badge variant={data.qtyOnHand > 0 ? "default" : "destructive"}>
          {data.qtyOnHand > 0 ? "In Stock" : "Out of Stock"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Package className="mr-2 h-5 w-5 text-muted-foreground" />
              Item Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-muted-foreground">Item Name</span>
              <span className="text-sm font-semibold">{data.item?.name || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-muted-foreground">SKU</span>
              <span className="text-sm">{data.item?.sku || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-muted-foreground">Item ID</span>
              <span className="text-sm font-mono text-[10px]">{data.itemId}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Warehouse className="mr-2 h-5 w-5 text-muted-foreground" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-muted-foreground">Warehouse</span>
              <span className="text-sm">{data.warehouse?.name || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-muted-foreground">Bin Location</span>
              <span className="text-sm">{data.bin?.code || 'Unassigned'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm font-medium text-muted-foreground">Warehouse ID</span>
              <span className="text-sm font-mono text-[10px]">{data.warehouseId}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Hash className="mr-2 h-5 w-5 text-muted-foreground" />
              Stock Levels & History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Quantity On Hand</p>
                <p className="text-3xl font-bold">{data.qtyOnHand.toLocaleString()}</p>
              </div>
              <Separator className="md:hidden" />
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Last Received</span>
                </div>
                <p className="text-sm">
                  {data.lastReceivedAt ? new Date(data.lastReceivedAt).toLocaleDateString() : 'Never'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Last PO Reference</span>
                </div>
                <p className="text-sm font-mono">{data.lastPoId || 'None'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryDetailView;