import React from 'react';
import { Paper, Box, Button, Divider, Typography, Stack } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

interface FormActionsSectionProps {
  initialData: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const FormActionsSection: React.FC<FormActionsSectionProps> = ({
  initialData,
  onSave,
  onCancel,
  isSubmitting
}) => {
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Action Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Define what happens when the form is submitted or cancelled.
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 4 }} />

      <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 1, mb: 4 }}>
        <Typography variant="subtitle2">Current Configuration ID: {initialData?.id}</Typography>
        <Typography variant="body2">Name: {initialData?.name}</Typography>
        <Typography variant="body2">Status: {initialData?.status}</Typography>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<CloseIcon />}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={() => onSave(initialData)}
          loading={isSubmitting}
        >
          Save Changes
        </Button>
      </Stack>
    </Paper>
  );
};