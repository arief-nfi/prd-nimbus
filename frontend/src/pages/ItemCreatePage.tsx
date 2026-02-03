import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemCreateForm } from '../components/ItemCreateForm';
import { useToast } from '../hooks/use-toast';
import { itemService } from '../services/item.service';
import { uomService } from '../services/uom.service';
import { Uom } from '../types/uom';
import { ItemCreateInput } from '../types/item';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertCircle } from 'lucide-react';

const ItemCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uoms, setUoms] = useState<Uom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const uomData = await uomService.getAll();
        setUoms(uomData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch UOMs:', err);
        setError('Failed to load required data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (data: ItemCreateInput) => {
    try {
      setIsSubmitting(true);
      await itemService.create(data);
      toast({
        title: 'Success',
        description: 'Item created successfully.',
        variant: 'default',
      });
      navigate('/items');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create item.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create New Item</h1>
        <p className="text-muted-foreground">
          Fill in the details below to add a new item to the inventory.
        </p>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <ItemCreateForm
          uoms={uoms}
          onSubmit={handleSave}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default ItemCreatePage;