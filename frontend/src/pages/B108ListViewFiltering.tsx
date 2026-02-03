import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Search, AlertCircle, Loader2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PurchaseOrder } from '@/types/purchase-order';
import { format } from 'date-fns';

const B108ListViewFiltering: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      // API call placeholder - in production this would use a defined service
      const response = await fetch('/api/purchase-orders?sort=poDate&order=desc');
      if (!response.ok) throw new Error('Failed to fetch purchase orders');
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const handleCreate = () => {
    navigate('/purchase-orders/new');
  };

  const handleView = (id: string) => {
    navigate(`/purchase-orders/${id}`);
  };

  const filteredData = data.filter(po => 
    po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'OPEN': return 'default';
      case 'CLOSED': return 'secondary';
      case 'CANCELLED': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">B.10.8 List View & Filtering</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Purchase Orders</CardTitle>
          <div className="flex items-center space-x-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by PO number or vendor..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No purchase orders found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>PO Date</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.poNumber}</TableCell>
                      <TableCell>{format(new Date(po.poDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{po.vendorName}</TableCell>
                      <TableCell>${po.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(po.status)}>
                          {po.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleView(po.id)}
                          className="flex items-center gap-1 ml-auto"
                        >
                          <Eye className="h-4 w-4" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default B108ListViewFiltering;