import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Eye, 
  Warehouse as WarehouseIcon, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Warehouse, WarehouseStatus } from '@/types/warehouse';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface WarehouseRowProps {
  warehouse: Warehouse;
  level: number;
  onView: (id: string) => void;
}

const WarehouseRow: React.FC<WarehouseRowProps> = ({ warehouse, level, onView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = warehouse.children && warehouse.children.length > 0;

  const getStatusColor = (status: WarehouseStatus) => {
    switch (status) {
      case WarehouseStatus.ACTIVE: return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case WarehouseStatus.INACTIVE: return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      case WarehouseStatus.MAINTENANCE: return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <>
      <TableRow className="group">
        <TableCell className="font-medium">
          <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
            {hasChildren ? (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 mr-2 hover:bg-slate-100 rounded-sm transition-colors"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : (
              <div className="w-8" />
            )}
            <WarehouseIcon size={18} className="mr-2 text-slate-400" />
            <span className="truncate max-w-[200px]">{warehouse.name}</span>
          </div>
        </TableCell>
        <TableCell className="hidden md:table-cell">{warehouse.nodeId}</TableCell>
        <TableCell>
          <Badge variant="outline">{warehouse.nodeType.replace('_', ' ')}</Badge>
        </TableCell>
        <TableCell className="hidden lg:table-cell">{warehouse.method}</TableCell>
        <TableCell>
          <Badge className={getStatusColor(warehouse.status)} variant="secondary">
            {warehouse.status}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onView(warehouse.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        </TableCell>
      </TableRow>
      {isExpanded && hasChildren && warehouse.children?.map((child) => (
        <WarehouseRow 
          key={child.id} 
          warehouse={child} 
          level={level + 1} 
          onView={onView} 
        />
      ))}
    </>
  );
};

export const WarehouseListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/warehouses?tree=true');
        if (!response.ok) throw new Error('Failed to fetch warehouse data');
        const data = await response.json();
        setWarehouses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading warehouse hierarchy...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">A.7.2 Warehouse List Screen</h1>
          <p className="text-muted-foreground">Manage your global warehouse hierarchy and storage nodes.</p>
        </div>
        <Button onClick={() => navigate('/warehouses/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[300px]">Node Name</TableHead>
              <TableHead className="hidden md:table-cell">Node ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden lg:table-cell">Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No warehouses found. Click 'Add New' to create one.
                </TableCell>
              </TableRow>
            ) : (
              warehouses.map((warehouse) => (
                <WarehouseRow 
                  key={warehouse.id} 
                  warehouse={warehouse} 
                  level={0} 
                  onView={(id) => navigate(`/warehouses/view/${id}`)} 
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WarehouseListScreen;