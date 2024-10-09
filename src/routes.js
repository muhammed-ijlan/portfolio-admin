import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import Profile from './pages/Profile';
import Admins from './pages/Admins';
import ViewAdmin from './pages/ViewAdmin';
import Employees from './pages/Employees';
import Configurations from './pages/Configurations';
import Enquiries from './pages/Enquiries';
import AddBlogPost from './pages/AddBlogPost';
import ViewBlogPost from './pages/ViewBlogPost';
import Categories from './pages/Categories';
import News from './pages/News';
import AddNewsPost from './pages/AddNewsPost';
import ViewNewsPost from './pages/ViewNewsPost';
import Projects from './pages/Projects';
import ProjectView from './pages/ProjectView';
import AddProject from './pages/AddProject';

// ----------------------------------------------------------------------

export default function Router() {
  const token = localStorage.getItem('accessToken');
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'projects', element: <Projects /> },
        { path: 'projects/view/:id', element: <ProjectView /> },
        { path: 'projects/add', element: <AddProject /> },
        { path: 'profile', element: <Profile /> },
        { path: 'account', element: <Admins /> },
        { path: 'account/view/:id', element: <ViewAdmin /> },
        // { path: 'employee', element: <Employees /> },
        // { path: 'configurations', element: <Configurations /> },
        { path: 'enquiry', element: <Enquiries /> },
        { path: 'blog', element: <Blog /> },
        { path: 'blog/add', element: <AddBlogPost /> },
        { path: 'blog/view/:id', element: <ViewBlogPost /> },
        { path: 'category', element: <Categories /> },
        { path: 'news', element: <News /> },
        { path: 'news/add', element: <AddNewsPost /> },
        { path: 'news/view/:id', element: <ViewNewsPost /> },


      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: token ? <Navigate to="/dashboard" /> : <Login /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
