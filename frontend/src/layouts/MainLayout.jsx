// MainLayout.jsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="container mx-auto p-4">{children}</main>
    <Footer />
  </>
);

export default MainLayout;

// DashboardLayout.jsx (untuk halaman yang diproteksi)
const DashboardLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <DashboardSidebar />
    <div className="ml-64 p-6">{children}</div>
  </div>
);