import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
            </Route>
            
            {/* Protected Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/enrolled" element={<EnrolledCourses />} /> {/* New route */}
            </Route>

            {/* Protected Instructor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
              <Route path="/instructor" element={<InstructorDashboard />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}