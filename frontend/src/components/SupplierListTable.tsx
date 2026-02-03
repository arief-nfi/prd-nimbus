import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Skeleton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Supplier } from '../types/supplier';

interface SupplierListTableProps {
  data: Supplier[];
  onView: (id: string) => void;
  isLoading: boolean;
}

const SupplierListTable: React.FC<SupplierListTableProps> = ({ data, onView, isLoading }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'error';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
      <Table sx={{ minWidth: 650 }} aria-label="supplier table">
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Supplier ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>PIC Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            Array.from(new Array(5)).map((_, index) => (
              <TableRow key={index}>
                {Array.from(new Array(6)).map((_, cellIndex) => (
                  <TableCell key={cellIndex}><Skeleton variant="text" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                No suppliers found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.suppId}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.picName}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status || 'N/A'} 
                    size="small" 
                    color={getStatusColor(row.status) as any} 
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton onClick={() => onView(row.id)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SupplierListTable;