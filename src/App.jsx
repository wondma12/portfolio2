import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './contexts/AppContext'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Home from './pages/Home'
import Projects from './pages/Projects'
import About from './pages/About'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Resume from './pages/Resume'
import NotFound from './pages/NotFound'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import ManageProjects from './admin/pages/ManageProjects'
import ManageBlog from './admin/pages/ManageBlog'
import ManageUsers from './admin/pages/ManageUsers'
import EditProfile from './admin/pages/EditProfile'
import Messages from './admin/pages/Messages'
import Login from './admin/pages/Login'
import ProtectedRoute from './router/ProtectedRoute'
import AdminRoute from './router/AdminRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resume" element={<Resume />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="blog" element={<ManageBlog />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="profile" element={<EditProfile />} />
              <Route path="messages" element={<Messages />} />
            </Route>
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App