import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Eye, 
  Loader2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PurchaseOrder } from '@/types/purchase-order';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const B70PurchaseOrderListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [data, setData] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchPurchaseOrders = useCallback(async () => {
    try {
      setLoading(true);
      // VR-030 & VR-010: Search is case-insensitive and partial matching (handled by backend)
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: search
      });

      const response = await fetch(`/api/purchase-orders?${query}`);
      if (!response.ok) throw new Error('Failed to fetch purchase orders');
      
      const result = await response.json();
      setData(result.data);
      setTotal(result.total);
      setError(null);
    } catch (err) {
      setError('Error loading purchase orders. Please try again later.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load data from server.'
      });
    } finally {
      setLoading(false);
    }
  }, [page, search, toast]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPurchaseOrders();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchPurchaseOrders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Draft: 'secondary',
      Submitted: 'default',
      'Partially Received': 'warning',
      Received: 'success',
      Closed: 'outline',
      Cancelled: 'destructive'
    };
    return <Badge variant={variants[status] as any}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">B.7.0 Purchase Order List Screen</h1>
        <Button onClick={() => navigate('/b70-purchase-order-list-screen/create')}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PO ID or Supplier (Case-insensitive)..."
                className="pl-8"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-64 text-destructive">
              <AlertCircle className="h-12 w-12 mb-2" />
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => fetchPurchaseOrders()}>
                Retry
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Grand Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No purchase orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">{po.poId}</TableCell>
                        <TableCell>{format(new Date(po.poDate), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{po.supplierName}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR'
                          }).format(po.grandTotal)}
                        </TableCell>
                        <TableCell>{getStatusBadge(po.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => navigate(`/b70-purchase-order-list-screen/view/${po.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> View
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} entries
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= total}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B70PurchaseOrderListScreen;