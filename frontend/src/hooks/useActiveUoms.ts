import { useState, useEffect } from 'react';
import axios from 'axios';

interface UomOption {
  id: string;
  code: string;
  name: string;
}

export const useActiveUoms = () => {
  const [uoms, setUoms] = useState<UomOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUoms = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/uoms/active');
        setUoms(response.data);
      } catch (err) {
        console.error('[VR-008] Failed to load active UOMs:', err);
        setError('Failed to load units of measure.');
      } finally {
        setLoading(false);
      }
    };

    fetchUoms();
  }, []);

  return { uoms, loading, error };
};