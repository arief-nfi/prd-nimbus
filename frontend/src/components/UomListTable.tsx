import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Box
} from '@mui/material';
import { Visibility as ViewIcon, Add as AddIcon } from '@mui/icons-material';
import { Uom } from '../types/uom';

interface UomListTableProps {
  data: Uom[];
  onAddNew: () => void;
  onView: (id: string) => void;
  isLoading: boolean;
}

const UomListTable: React.FC<UomListTableProps> = ({ data, onAddNew, onView, isLoading }) => {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddNew}
          disabled={isLoading}
        >
          Add New UOM
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader aria-label="uom table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>UOM ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No records found</TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>{row.uomId}</TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton onClick={() => onView(row.id)} color="info">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UomListTable;