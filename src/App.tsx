import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import UserManagement from './pages/UserManagement.tsx';
import StudentData from './pages/StudentData.tsx';
import AttendanceEmployee from './pages/AttendanceEmployee.tsx';
import AttendanceStudent from './pages/AttendanceStudent.tsx';
import AttendanceRecap from './pages/AttendanceRecap.tsx';
import TKJExam from './pages/TKJExam.tsx';
import Layout from './components/Layout.tsx';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase.ts';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/app" element={session ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="absensi-karyawan" element={<AttendanceEmployee />} />
          <Route path="absensi-siswa" element={<AttendanceStudent />} />
          <Route path="rekap" element={<AttendanceRecap />} />
          <Route path="data-siswa" element={<StudentData />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="ujian" element={<TKJExam />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
