// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-lg mb-4">Maaf, halaman yang Anda cari tidak ada.</p>
      <Link 
        to="/" 
        className="text-blue-500 hover:text-blue-700 transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}