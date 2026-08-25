import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Projects from '../pages/Projects';
import About from '../pages/About';
import Blog from '../pages/Blog';
import Contact from '../pages/Contact';
import Resume from '../pages/Resume';
import NotFound from '../pages/NotFound';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../admin/pages/Dashboard';
import ManageProjects from '../admin/pages/ManageProjects';
import ManageBlog from '../admin/pages/ManageBlog';
import ManageUsers from '../admin/pages/ManageUsers';
import EditProfile from '../admin/pages/EditProfile';
import Messages from '../admin/pages/Messages';
import Login from '../admin/pages/Login';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Home /> },
            { path: 'projects', element: <Projects /> },
            { path: 'about', element: <About /> },
            { path: 'blog', element: <Blog /> },
            { path: 'blog/:slug', element: <Blog /> },
            { path: 'contact', element: <Contact /> },
            { path: 'resume', element: <Resume /> }
        ]
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute>
                <AdminRoute>
                    <AdminLayout />
                </AdminRoute>
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'projects', element: <ManageProjects /> },
            { path: 'blog', element: <ManageBlog /> },
            { path: 'users', element: <ManageUsers /> },
            { path: 'profile', element: <EditProfile /> },
            { path: 'messages', element: <Messages /> }
        ]
    },
    {
        path: '/admin/login',
        element: <Login />
    },
    {
        path: '*',
        element: <NotFound />
    }
]);