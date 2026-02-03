import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Eye, 
  Search, 
  Loader2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Inventory } from '@/types/inventory';

const InventoryListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchInventory = async () => {
    try {
      setLoading(true);
      // VR-010 & VR-030: Search sensitivity (case-insensitive substring) handled by backend query
      const response = await fetch(`/api/inventory?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      if (!response.ok) throw new Error('Failed to fetch inventory data');
      const result = await response.json();
      setData(result.data);
      setTotal(result.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleCreate = () => navigate('/a79-inventory-list-screen/create');
  const handleView = (id: string) => navigate(`/a79-inventory-list-screen/view/${id}`);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">A.7.9 Inventory List Screen</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus size={16} /> Add New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Item SKU, Name or Warehouse (Case-insensitive)..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item SKU</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead className="text-right">Qty On Hand</TableHead>
                    <TableHead>Last Received</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No inventory records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.item?.sku || 'N/A'}</TableCell>
                        <TableCell>{item.item?.name || 'N/A'}</TableCell>
                        <TableCell>{item.warehouse?.name || 'N/A'}</TableCell>
                        <TableCell className="text-right">{item.qtyOnHand.toLocaleString()}</TableCell>
                        <TableCell>
                          {item.lastReceivedAt ? new Date(item.lastReceivedAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleView(item.id)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              <ChevronLeft size={16} /> Previous
            </Button>
            <div className="text-sm font-medium">
              Page {page} of {Math.ceil(total / limit) || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / limit) || loading}
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryListScreen;