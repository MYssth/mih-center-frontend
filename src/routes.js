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

//
import MIHIntranet from './mih_intranet/mihIntranet';

// PMS
import PMSUserMgr from './mih_intranet/PMS/PMSUserMgr';

// CBS
import CBSDashboard from './mih_intranet/CBS/CBSDashboard';
import CBSBooking from './mih_intranet/CBS/CBSBooking';
import CBSPermitRep from './mih_intranet/CBS/CBSPermitRep';
import CBSPermit from './mih_intranet/CBS/CBSPermit';
import CBSUseRec from './mih_intranet/CBS/CBSUseRec';
import CBSBookRprt from './mih_intranet/CBS/CBSBookRprt';
import CBSMergeBook from './mih_intranet/CBS/CBSMergeBook';

// IIOS
import IIOSUserDashboard from './mih_intranet/IIOS/IIOSUserDashboard';
import IIOSITMTDashboard from './mih_intranet/IIOS/IIOSITMTDashboard';
import IIOSPermit from './mih_intranet/IIOS/IIOSPermit';
import IIOSInformerTask from './mih_intranet/IIOS/IIOSInformerTask';
import IIOSAudit from './mih_intranet/IIOS/IIOSAudit';
import IIOSNewCase from './mih_intranet/IIOS/IIOSNewCase';
import IIOSReport from './mih_intranet/IIOS/IIOSReportPage';
import IIOSUsrPermit from './mih_intranet/IIOS/IIOSUsrPermit';

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
      path: '/intranet',
      element: <MIHIntranet />,
      index: true
    },

    // PMS
    {
      path: '/pmsusermgr',
      element: <PMSUserMgr />,
    },

    // CBS
    {
      path: '/cbsdashboard',
      element: <CBSDashboard />,
    },
    {
      path: '/cbsbooking',
      element: <CBSBooking />,
    },
    {
      path: '/cbspermitreq',
      element: <CBSPermitRep />,
    },
    {
      path: '/cbspermit',
      element: <CBSPermit />,
    },
    {
      path: '/cbsuserec',
      element: <CBSUseRec />,
    },
    {
      path: '/cbsbookrprt',
      element: <CBSBookRprt />,
    },
    {
      path: '/cbsmergebook',
      element: <CBSMergeBook />,
    },

    // IIOS
    {
      path: '/iiosuserdashboard',
      element: <IIOSUserDashboard />,
    },
    {
      path: '/iiositmtdashboard',
      element: <IIOSITMTDashboard />,
    },
    {
      path: '/iiospermit',
      element: <IIOSPermit />,
    },
    {
      path: '/iiosinformertask',
      element: <IIOSInformerTask />,
    },
    {
      path: '/iiosaudit',
      element: <IIOSAudit />,
    },
    {
      path: '/iiosnewcase',
      element: <IIOSNewCase />,
    },
    {
      path: '/iiosreport',
      element: <IIOSReport />,
    },
    {
      path: '/iiosusrpermit',
      element: <IIOSUsrPermit />,
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
