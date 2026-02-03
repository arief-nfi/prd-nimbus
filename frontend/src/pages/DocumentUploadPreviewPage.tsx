import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Breadcrumbs, 
  Link, 
  CircularProgress, 
  Alert, 
  Snackbar 
} from '@mui/material';
import { DocumentUploadPreview } from '../components/DocumentUploadPreview';
import { useAuth } from '../hooks/useAuth';

interface DocumentData {
  id: string;
  name: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadDate: string;
  previewUrl?: string;
  type: string;
}

const DocumentUploadPreviewPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchDocumentDetails = useCallback(async () => {
    try {
      setLoading(true);
      // API call placeholder - replace with actual service call
      // const response = await documentService.getById(documentId);
      
      // Mock data for demonstration
      const mockData: DocumentData = {
        id: documentId || 'DOC-12345',
        name: 'Passport_Scan_Final.pdf',
        status: 'pending',
        uploadDate: new Date().toISOString(),
        previewUrl: 'https://example.com/mock-preview.pdf',
        type: 'Identity Verification'
      };

      setDocument(mockData);
      setError(null);
    } catch (err) {
      setError('Failed to load document details. Please try again later.');
      console.error('Error fetching document:', err);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDocumentDetails();
  }, [isAuthenticated, navigate, fetchDocumentDetails]);

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      // API call placeholder for file upload
      // await documentService.upload(file);
      
      setNotification({
        open: true,
        message: 'Document uploaded successfully.',
        severity: 'success',
      });
      fetchDocumentDetails();
    } catch (err) {
      setNotification({
        open: true,
        message: 'Failed to upload document.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading && !document) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/dashboard">
            Dashboard
          </Link>
          <Link underline="hover" color="inherit" href="/documents">
            Documents
          </Link>
          <Typography color="text.primary">Upload & Preview</Typography>
        </Breadcrumbs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <DocumentUploadPreview
        document={document}
        onUpload={handleFileUpload}
        isProcessing={loading}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DocumentUploadPreviewPage;