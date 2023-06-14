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
import InformerTask from './pages/DMIS/InformerTask';

// DSMS
import DSMSDashboardLayout from './pages/DSMS/DSMSDashboardLayout';
import DSMSDashboard from './pages/DSMS/DSMSDashboard';
import DSMSBookShift from './pages/DSMS/DSMSBookShift';
import DSMSManageBook from './pages/DSMS/DSMSManageBook';
import DSMSSetting from './pages/DSMS/DSMSSetting';

// CBS
import MIHIntranet from './mih_intranet/MIHIntranet';
import CBSDashboard from './mih_intranet/CBS/Dashboard';
import CBSBooking from './mih_intranet/CBS/Booking';
import CBSPermit from './mih_intranet/CBS/Permit';
import CBSUseRec from './mih_intranet/CBS/UseRec';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([

    {
      path: '/intranet',
      element: <MIHIntranet />,
      index: true
    },
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
        { path: 'sitesetting', element: <SiteSetting /> }
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
        { path: 'informertask', element: <InformerTask /> },
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
        { path: 'dsmsmanagebook', element: <DSMSManageBook /> },
        { path: 'dsmssetting', element: <DSMSSetting /> }
      ],
    },
    {
      path: '/cbsdashboard',
      element: <CBSDashboard />,
    },
    {
      path: '/cbsbooking',
      element: <CBSBooking />,
    },
    {
      path: '/cbspermit',
      element: <CBSPermit />,
    },
    {
      path: '/cbsuserec',
      element: <CBSUseRec />
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/intranet" />, index: true },
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
