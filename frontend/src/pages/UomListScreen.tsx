import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Eye, 
  AlertCircle, 
  Loader2, 
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
import { Badge } from '@/components/ui/badge';
import { Uom, UomListResponse, UomStatus } from '@/types/uom';

const UomListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Uom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 10;

  const fetchUoms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // VR-010: Search is case-insensitive and partial matching (handled by backend query)
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: search
      });

      const response = await fetch(`/api/uom?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch UOM data');
      
      const result: UomListResponse = await response.json();
      setData(result.data);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUoms();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchUoms]);

  const handleCreate = () => navigate('/a78-uom-list-screen/create');
  const handleView = (id: string) => navigate(`/a78-uom-list-screen/view/${id}`);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">A.7.8 UOM List Screen</h1>
          <p className="text-muted-foreground">Manage Units of Measure (UOM) for items.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search UOM ID or Name..."
            className="pl-8"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UOM ID</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading data...
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No UOMs found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((uom) => (
                <TableRow key={uom.id}>
                  <TableCell className="font-medium">{uom.uomId}</TableCell>
                  <TableCell>{uom.code}</TableCell>
                  <TableCell>{uom.name}</TableCell>
                  <TableCell>
                    <Badge variant={uom.status === UomStatus.Active ? 'default' : 'secondary'}>
                      {uom.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(uom.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleView(uom.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {data.length} of {total} results
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">Page {page}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page * limit >= total || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UomListScreen;