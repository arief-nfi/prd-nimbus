import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Container, Typography, Breadcrumbs, Link, Skeleton, Alert, AlertTitle, Paper } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import TreeViewBehaviorComponent from '../components/TreeViewBehavior';

interface TreeDataNode {
  id: string;
  label: string;
  children?: TreeDataNode[];
  type: 'folder' | 'file';
  metadata?: Record<string, any>;
}

const TreeViewBehaviorPage: React.FC = () => {
  const [data, setData] = useState<TreeDataNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulated API call - In production, replace with actual service call
      // const response = await api.get('/api/tree-structure');
      const mockData: TreeDataNode[] = [
        {
          id: 'root',
          label: 'Project Root',
          type: 'folder',
          children: [
            {
              id: 'src',
              label: 'src',
              type: 'folder',
              children: [
                { id: 'app-ts', label: 'App.tsx', type: 'file' },
                { id: 'index-ts', label: 'index.tsx', type: 'file' },
              ],
            },
            {
              id: 'assets',
              label: 'assets',
              type: 'folder',
              children: [
                { id: 'logo-png', label: 'logo.png', type: 'file' },
              ],
            },
            { id: 'package-json', label: 'package.json', type: 'file' },
          ],
        },
      ];
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setData(mockData);
    } catch (err) {
      setError('Failed to load tree structure. Please try again later.');
      console.error('Error fetching tree data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNodeSelect = (nodeId: string) => {
    console.log(`Node selected: ${nodeId}`);
  };

  const handleToggle = (nodeIds: string[]) => {
    console.log('Nodes toggled:', nodeIds);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" action={<Link component="button" onClick={fetchData}>Retry</Link>}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Typography color="text.primary">A.10.3 Tree View Behavior</Typography>
          </Breadcrumbs>
          <Typography variant="h4" component="h1" sx={{ mt: 2, fontWeight: 'bold' }}>
            Tree View Behavior
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Manage and navigate hierarchical data structures with advanced node behaviors.
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ p: 3, minHeight: '400px', backgroundColor: 'background.paper' }}>
          {loading ? (
            <Box>
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2, borderRadius: 1 }} />
            </Box>
          ) : (
            <TreeViewBehaviorComponent 
              data={data} 
              onNodeSelect={handleNodeSelect}
              onToggle={handleToggle}
            />
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default TreeViewBehaviorPage;