import React, { useEffect, useState } from 'react';
import { WarehouseTreeItem } from '@/components/WarehouseTreeItem';
import { Warehouse } from '@/types/warehouse';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WarehouseTreeView: React.FC = () => {
  const [data, setData] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/warehouses/tree');
      if (!response.ok) throw new Error('Failed to fetch warehouse hierarchy');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold"># Tree View Behavior</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchWarehouses} 
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
          <p className="text-muted-foreground">View Warehouse List with children nodes and hierarchical structure.</p>
        </CardHeader>
        <CardContent className="px-0 pt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : data.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No warehouse data found.</p>
            </div>
          ) : (
            <div className="bg-card border rounded-lg p-4">
              {data.map((warehouse) => (
                <WarehouseTreeItem key={warehouse.id} node={warehouse} level={0} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseTreeView;

// Helper for tailwind classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}