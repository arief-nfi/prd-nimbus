import { useState, useCallback } from 'react';
import { ItemInput } from '../../../shared/validation/item-validation.schema';

export const useItemGrid = (initialItems: ItemInput[] = []) => {
  const [items, setItems] = useState<ItemInput[]>(initialItems);
  const [error, setError] = useState<string | null>(null);

  const removeItem = useCallback((index: number) => {
    if (items.length <= 1) {
      setError("Cannot delete last item. Minimum 1 item required");
      return false;
    }

    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    setError(null);
    return true;
  }, [items]);

  const addItem = useCallback((item: ItemInput) => {
    setItems(prev => [...prev, item]);
    setError(null);
  }, []);

  return {
    items,
    removeItem,
    addItem,
    error,
    isValid: items.length >= 1
  };
};