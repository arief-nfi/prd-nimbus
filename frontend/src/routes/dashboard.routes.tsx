import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const DashboardLayoutPage = lazy(() => import('../pages/DashboardLayoutPage'));

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'd21-dashboard-layout',
    element: <DashboardLayoutPage />,
  }
];