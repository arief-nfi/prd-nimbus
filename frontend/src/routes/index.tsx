import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PATHS } from './paths';
import { AuthGuard } from './guards/AuthGuard';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';

// Lazy load pages
const LoginPage = lazy(() => import('../pages/LoginPage'));
const A71WarehouseCreateScreenPage = lazy(() => import('../pages/A71WarehouseCreateScreenPage'));
const A73SupplierCreateScreenPage = lazy(() => import('../pages/A73SupplierCreateScreenPage'));
const A74SupplierListScreenPage = lazy(() => import('../pages/A74SupplierListScreenPage'));
const A75ItemCreateScreenPage = lazy(() => import('../pages/A75ItemCreateScreenPage'));
const A76ItemListScreenPage = lazy(() => import('../pages/A76ItemListScreenPage'));
const A77UOMCreateScreenPage = lazy(() => import('../pages/A77UOMCreateScreenPage'));
const A78UOMListScreenPage = lazy(() => import('../pages/A78UOMListScreenPage'));
const A79InventoryListScreenPage = lazy(() => import('../pages/A79InventoryListScreenPage'));
const A710InventoryViewDetailPage = lazy(() => import('../pages/A710InventoryViewDetailPage'));
const B70PurchaseOrderListScreenPage = lazy(() => import('../pages/B70PurchaseOrderListScreenPage'));
const B71PurchaseOrderCreateScreenPage = lazy(() => import('../pages/B71PurchaseOrderCreateScreenPage'));
const B72POItemListPage = lazy(() => import('../pages/B72POItemListPage'));
const B107DocumentUploadPreviewPage = lazy(() => import('../pages/B107DocumentUploadPreviewPage'));
const C72FormInputsPage = lazy(() => import('../pages/C72FormInputsPage'));
const C75ModalPage = lazy(() => import('../pages/C75ModalPage'));
const C76FormPage = lazy(() => import('../pages/C76FormPage'));
const D21DashboardLayoutPage = lazy(() => import('../pages/D21DashboardLayoutPage'));
const D22DashboardCardsDefinitionPage = lazy(() => import('../pages/D22DashboardCardsDefinitionPage'));
const D31ListPagePatternPage = lazy(() => import('../pages/D31ListPagePatternPage'));
const A103TreeViewBehaviorPage = lazy(() => import('../pages/A103TreeViewBehaviorPage'));
const ViewModeBehaviorPage = lazy(() => import('../pages/ViewModeBehaviorPage'));
const A107ViewModePage = lazy(() => import('../pages/A107ViewModePage'));
const A109InventoryViewPage = lazy(() => import('../pages/A109InventoryViewPage'));
const B1011FormActionsPage = lazy(() => import('../pages/B1011FormActionsPage'));
const B108ListViewFilteringPage = lazy(() => import('../pages/B108ListViewFilteringPage'));
const B1010ViewModePage = lazy(() => import('../pages/B1010ViewModePage'));

const LoadingFallback = () => <div className="flex h-screen items-center justify-center">Loading...</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={PATHS.A71_WAREHOUSE_CREATE} replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: PATHS.LOGIN, element: <Suspense fallback={<LoadingFallback />}><LoginPage /></Suspense> },
    ],
  },
  {
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      { path: PATHS.A71_WAREHOUSE_CREATE, element: <A71WarehouseCreateScreenPage /> },
      { path: PATHS.A73_SUPPLIER_CREATE, element: <A73SupplierCreateScreenPage /> },
      { path: PATHS.A74_SUPPLIER_LIST, element: <A74SupplierListScreenPage /> },
      { path: PATHS.A75_ITEM_CREATE, element: <A75ItemCreateScreenPage /> },
      { path: PATHS.A76_ITEM_LIST, element: <A76ItemListScreenPage /> },
      { path: PATHS.A77_UOM_CREATE, element: <A77UOMCreateScreenPage /> },
      { path: PATHS.A78_UOM_LIST, element: <A78UOMListScreenPage /> },
      { path: PATHS.A79_INVENTORY_LIST, element: <A79InventoryListScreenPage /> },
      { path: PATHS.A710_INVENTORY_DETAIL, element: <A710InventoryViewDetailPage /> },
      { path: PATHS.B70_PO_LIST, element: <B70PurchaseOrderListScreenPage /> },
      { path: PATHS.B71_PO_CREATE, element: <B71PurchaseOrderCreateScreenPage /> },
      { path: PATHS.B72_PO_ITEM_LIST, element: <B72POItemListPage /> },
      { path: PATHS.B107_DOC_UPLOAD, element: <B107DocumentUploadPreviewPage /> },
      { path: PATHS.C72_FORM_INPUTS, element: <C72FormInputsPage /> },
      { path: PATHS.C75_MODAL, element: <C75ModalPage /> },
      { path: PATHS.C76_FORM_SLIDE, element: <C76FormPage /> },
      { path: PATHS.D21_DASHBOARD, element: <D21DashboardLayoutPage /> },
      { path: PATHS.D22_DASHBOARD_CARDS, element: <D22DashboardCardsDefinitionPage /> },
      { path: PATHS.D31_LIST_PATTERN, element: <D31ListPagePatternPage /> },
      { path: PATHS.A103_TREE_VIEW, element: <A103TreeViewBehaviorPage /> },
      { path: PATHS.VIEW_MODE_A_005, element: <ViewModeBehaviorPage /> },
      { path: PATHS.A107_VIEW_MODE, element: <A107ViewModePage /> },
      { path: PATHS.VIEW_MODE_A_008, element: <ViewModeBehaviorPage /> },
      { path: PATHS.VIEW_MODE_A_013, element: <ViewModeBehaviorPage /> },
      { path: PATHS.VIEW_MODE_A_026, element: <ViewModeBehaviorPage /> },
      { path: PATHS.A109_INVENTORY_VIEW, element: <A109InventoryViewPage /> },
      { path: PATHS.B1011_FORM_ACTIONS, element: <B1011FormActionsPage /> },
      { path: PATHS.B108_LIST_FILTERING, element: <B108ListViewFilteringPage /> },
      { path: PATHS.VIEW_MODE_B_047, element: <ViewModeBehaviorPage /> },
      { path: PATHS.B1010_VIEW_MODE, element: <B1010ViewModePage /> },
    ].map(route => ({
      ...route,
      element: <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>
    }))
  },
  { path: '*', element: <Navigate to={PATHS.NOT_FOUND} replace /> },
]);