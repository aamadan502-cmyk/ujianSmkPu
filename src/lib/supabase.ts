import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'guru' | 'tenaga_kependidikan';
  created_at: string;
};

export type Student = {
  id: string;
  nis: string;
  name: string;
  class: string;
  created_at: string;
};

export type Attendance = {
  id: string;
  user_id?: string;
  student_id?: string;
  type: 'karyawan' | 'siswa';
  status: 'hadir' | 'sakit' | 'izin' | 'alfa';
  date: string;
  created_at: string;
  created_by?: string;
};
