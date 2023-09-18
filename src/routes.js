import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import SimpleLayout from './layouts/simple';
import LoginPage from './mih_intranet/LoginPage';
import Page404 from './mih_intranet/Page404';

// DSMS
import DSMSDashboard from './mih_intranet/DSMS/DSMSDashboard';
import DSMSBookShift from './mih_intranet/DSMS/DSMSBookShift';
import DSMSShiftSetting from './mih_intranet/DSMS/DSMSShiftSetting';
import DSMSShiftEdit from './mih_intranet/DSMS/DSMSShiftEdit';

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

// TRS
import TRSDashboard from './mih_intranet/TRS/TRSDashboard';
import TRSTopicRes from './mih_intranet/TRS/TRSTopicRes';
import TRSAttdMgr from './mih_intranet/TRS/TRSAttdMgr';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/intranet',
      element: <MIHIntranet />,
      index: true,
    },

    // PMS
    {
      path: '/pmsusermgr',
      element: <PMSUserMgr />,
    },

    // DSMS
    {
      path: '/dsmsdashboard',
      element: <DSMSDashboard />,
    },
    {
      path: '/dsmsbook',
      element: <DSMSBookShift />,
    },
    {
      path: '/dsmssetting',
      element: <DSMSShiftSetting />,
    },
    {
      path: '/dsmsedit',
      element: <DSMSShiftEdit />,
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

    // TRS
    {
      path: '/trsdashboard',
      element: <TRSDashboard />,
    },
    {
      path: '/trstopicres',
      element: <TRSTopicRes />,
    },
    {
      path: '/trsattdmgr',
      element: <TRSAttdMgr />,
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
