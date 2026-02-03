import { useState, useCallback } from 'react';
import { POSearchInput } from '../types/po';

export const usePOSearch = () => {
  const [filters, setFilters] = useState<POSearchInput>({
    search: '',
    page: 1,
    limit: 10,
  });

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1, // Reset to first page on new search
    }));
  }, []);

  return {
    filters,
    handleSearchChange,
    setFilters,
  };
};