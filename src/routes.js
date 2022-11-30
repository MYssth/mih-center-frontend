import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import UserPageNewUser from './pages/UserPageNewUser';
import ProfileSetting from './pages/ProfileSetting';

// DMIS
import DMISDashboardLayout from './pages/DMIS/DMISDashboardLayout';
import ITMTDashboard from './pages/DMIS/ITMTDashboard';
import UserDashboard from './pages/DMIS/UserDashboard';
import DMISNewCase from './pages/DMIS/DMISNewCase';

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
        { path: 'newuser', element: <UserPageNewUser />},
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/profilesetting',
      element: <ProfileSetting />,
    },
    {
      path: '/dmis',
      element: <DMISDashboardLayout />,
      children: [
        { element: <Navigate to="/dmis/app" />, index: true },
        { path: 'app', element: <DMISDashboardLayout /> },
        { path: 'itmtdashboard', element: <ITMTDashboard />},
        { path: 'userdashboard', element: <UserDashboard />},
        { path: 'dmisnewcase', element: <DMISNewCase />}
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
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
