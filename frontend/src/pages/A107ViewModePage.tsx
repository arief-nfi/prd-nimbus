import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { A107ViewMode } from '../components/A107ViewMode';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { Alert, Skeleton, Box, Container } from '@mui/material';

interface DocumentData {
  id: string;
  title: string;
  content: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  lastModified: string;
  author: {
    id: string;
    name: string;
  };
  metadata: Record<string, any>;
}

const A107ViewModePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/documents/${id}`);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load document details');
      console.error('Error fetching document:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [fetchData, isAuthenticated, navigate]);

  const handleEditClick = () => {
    navigate(`/a107-edit-mode/${id}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      const response = await api.get(`/documents/${id}/export`, {
        params: { format },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document-${id}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={40} width="60%" sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" onClose={() => navigate('/documents')}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No document found.</Alert>
      </Container>
    );
  }

  return (
    <Box className="page-layout-description">
      <Suspense fallback={<Skeleton variant="rectangular" height={600} />}>
        <A107ViewMode
          data={data}
          onEdit={handleEditClick}
          onBack={handleBackClick}
          onExport={handleExport}
          currentUserRole={user?.role}
        />
      </Suspense>
    </Box>
  );
};

export default A107ViewModePage;