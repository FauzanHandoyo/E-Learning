import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';

import {
  Home,
  Login,
  Register,
  StudentDashboard,
  InstructorDashboard,
  NotFound
} from '../pages';
// Di AppRoutes.jsx
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      }
    ]
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [
          {
            path: '/student',
            element: <StudentDashboard />
          }
        ]
      }
    ]
  }
]);

export default router;