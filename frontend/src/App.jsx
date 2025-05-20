import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar'; // Pastikan path sesuai struktur folder
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import EnrolledCourses from './pages/EnrolledCourses'; // New import
import UserProfile from './pages/ProfilePage';
import InstructorCourses from './pages/instructor/InstructorCourses';
import CreateCourse from './pages/instructor/CreateCourse';
import EditCourse from './pages/instructor/EditCourse';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main className="container mx-auto p-4 mt-16"> {/* Tambahkan mt-16 untuk offset navbar fixed */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

             {/* Protected Routes for all authenticated users */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'instructor']} />}>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/main" element={<StudentDashboard />} /> {/* Renamed from '/student' to '/main' */}
              <Route path="/enrolled" element={<EnrolledCourses />} />
            </Route>

            {/* Keep the original '/student' route for backward compatibility */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'instructor']} />}>
              <Route path="/student" element={<Navigate to="/main" replace />} />
            </Route>

            {/* Redirect instructor dashboard to main */}
            <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
              <Route path="/instructor" element={<Navigate to="/main" replace />} />
              <Route path="/instructor/courses" element={<InstructorCourses />} />
              <Route path="/instructor/create-course" element={<CreateCourse />} />
              <Route path="/instructor/courses/:courseId/edit" element={<EditCourse />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}