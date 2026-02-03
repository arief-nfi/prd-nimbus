import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InventoryView } from '../components/InventoryView';
import { InventoryService } from '../services/inventory.service';
import { Inventory } from '../types/inventory';
import { Skeleton } from '../components/ui/Skeleton';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { RefreshCcw, ArrowLeft } from 'lucide-react';

const InventoryViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventoryData = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await InventoryService.getInventoryById(id);
      if (!data) {
        setError('Inventory record not found.');
      } else {
        setInventory(data);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching inventory data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInventoryData();
  }, [fetchInventoryData]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    fetchInventoryData();
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-4">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
          <Button onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!inventory) return null;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Details</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <InventoryView 
          data={inventory} 
          onUpdate={handleRefresh}
        />
      </div>
    </div>
  );
};

export default InventoryViewPage;