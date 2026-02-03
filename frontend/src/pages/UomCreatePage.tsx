import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Breadcrumbs,
  Link,
  Stack,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

const uomSchema = z.object({
  uomId: z.string().min(1, 'UOM ID is required'),
  code: z.string().min(1, 'Code is required').max(10, 'Code must be 10 characters or less'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
});

type UomFormData = z.infer<typeof uomSchema>;

const UomCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UomFormData>({
    resolver: zodResolver(uomSchema),
    defaultValues: {
      uomId: '',
      code: '',
      name: '',
    },
  });

  const onSubmit = async (data: UomFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/uom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create UOM');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/a77-uom-list-screen');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/a77-uom-list-screen">
          UOM Management
        </Link>
        <Typography color="text.primary">Create UOM</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>
        Create Unit of Measure (UOM)
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card variant="outlined">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                label="UOM ID"
                {...register('uomId')}
                error={!!errors.uomId}
                helperText={errors.uomId?.message}
                fullWidth
                disabled={isSubmitting}
              />

              <TextField
                label="Code"
                {...register('code')}
                error={!!errors.code}
                helperText={errors.code?.message}
                fullWidth
                disabled={isSubmitting}
              />

              <TextField
                label="Name"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                disabled={isSubmitting}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          UOM created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UomCreatePage;