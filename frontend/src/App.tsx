import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const POItemListPage = lazy(() => import('./pages/POItemListPage'));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      }>
        <Routes>
          <Route path="/b72-po-item-list" element={<POItemListPage />} />
          {/* Other routes */}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;