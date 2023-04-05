import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import UserPageNewUser from './pages/UserPageNewUser';
import ProfileSetting from './pages/ProfileSetting';
import RoleMgrPage from './pages/RoleMgrPage';
import SiteSetting from './pages/SiteSetting';

// DMIS
import DMISDashboardLayout from './pages/DMIS/DMISDashboardLayout';
import ITMTDashboard from './pages/DMIS/ITMTDashboard';
import UserDashboard from './pages/DMIS/UserDashboard';
import DMISNewCase from './pages/DMIS/DMISNewCase';
import DMISReport from './pages/DMIS/DMISReport';
import AuditDashboard from './pages/DMIS/AuditDashboard';
import PermitDashboard from './pages/DMIS/PermitDashboard';

// DSMS
import DSMSDashboardLayout from './pages/DSMS/DSMSDashboardLayout';
import DSMSDashboard from './pages/DSMS/DSMSDashboard';
import DSMSBookShift from './pages/DSMS/DSMSBookShift';
import DSMSManageBook from './pages/DSMS/DSMSManageBook';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([

    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'newuser', element: <UserPageNewUser /> },
        { path: 'profilesetting', element: <ProfileSetting /> },
        { path: 'rolemgr', element: <RoleMgrPage /> },
        { path: 'sitesetting', element: <SiteSetting />}
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/dmis',
      element: <DMISDashboardLayout />,
      children: [
        { element: <Navigate to="/dmis/app" />, index: true },
        { path: 'app', element: <UserDashboard /> },
        { path: 'itmtdashboard', element: <ITMTDashboard /> },
        { path: 'dmisnewcase', element: <DMISNewCase /> },
        { path: 'dmisreport', element: <DMISReport /> },
        { path: 'auditdashboard', element: <AuditDashboard /> },
        { path: 'permitdashboard', element: <PermitDashboard /> },
      ],
    },
    {
      path: '/dsms',
      element: <DSMSDashboardLayout />,
      children: [
        { element: <Navigate to="/dsms/app" />, index: true },
        { path: 'app', element: <DSMSDashboard /> },
        { path: 'dsmsbookshift', element: <DSMSBookShift /> },
        { path: 'dsmsmanagebook', element: <DSMSManageBook />},
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
