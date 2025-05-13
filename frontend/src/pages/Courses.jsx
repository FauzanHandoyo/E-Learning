// import { motion } from 'framer-motion';

import CourseCard from '../components/CourseCard';
import { useEffect, useState } from 'react';
import api from '../services/api'; // Pastikan jalur benar

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Courses() {
  const [courses, setCourses] = useState([]); // Menyimpan data kursus
  const [loading, setLoading] = useState(true); // Untuk status loading
  const [error, setError] = useState(null); // Untuk pesan error

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses'); // Sesuaikan dengan endpoint kamu
        setCourses(response.data);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat kursus');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p className="text-center py-10">Memuat kursus...</p>;
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-24"
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Semua Kursus</h1>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {courses.map((course, index) => (
          <motion.div
            key={course._id || index} // Gunakan _id jika tersedia
            variants={itemVariants}
          >
            <CourseCard course={course} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}