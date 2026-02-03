import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormActionsSection } from '../components/FormActionsSection';
import { Alert, CircularProgress, Box, Container, Typography, Breadcrumbs, Link } from '@mui/material';
import { useSnackbar } from 'notistack';

interface FormData {
  id?: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  updatedAt?: string;
}

const FormActionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [data, setData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulate API call
      const response = await new Promise<FormData>((resolve) => {
        setTimeout(() => {
          resolve({
            id: '162',
            name: 'Sample Form Configuration',
            description: 'This is a description for the B.10.11 Form Actions demonstration.',
            status: 'draft',
            updatedAt: new Date().toISOString(),
          });
        }, 800);
      });
      setData(response);
    } catch (err) {
      setError('Failed to load form data. Please try again later.');
      enqueueSnackbar('Error loading data', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (updatedData: Partial<FormData>) => {
    try {
      setIsSaving(true);
      // Simulate API update
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      setData(prev => prev ? { ...prev, ...updatedData } : null);
      enqueueSnackbar('Form actions saved successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Failed to save changes', { variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading form configuration...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" action={
          <Link component="button" onClick={() => fetchData()}>Retry</Link>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Main
        </Link>
        <Typography color="text.primary">B.10.11 Form Actions</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Form Actions Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure and manage the actions available for this specific form instance.
        </Typography>
      </Box>

      <FormActionsSection
        initialData={data}
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSaving}
      />
    </Container>
  );
};

export default FormActionsPage;