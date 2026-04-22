import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase, Profile, Attendance } from '../lib/supabase.ts';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, AlertCircle, History, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AttendanceEmployee() {
  const { profile } = useOutletContext<{ profile: Profile }>();
  const [loading, setLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [history, setHistory] = useState<Attendance[]>([]);

  useEffect(() => {
    fetchTodayAttendance();
    fetchHistory();
  }, [profile]);

  async function fetchTodayAttendance() {
    if (!profile) return;
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('attendances')
      .select('*')
      .eq('user_id', profile.id)
      .eq('date', today)
      .eq('type', 'karyawan')
      .maybeSingle();
    
    if (data) setTodayAttendance(data);
  }

  async function fetchHistory() {
    if (!profile) return;
    const { data, error } = await supabase
      .from('attendances')
      .select('*')
      .eq('user_id', profile.id)
      .eq('type', 'karyawan')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setHistory(data);
  }

  const handleAttendance = async (status: 'hadir' | 'sakit' | 'izin') => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      const { data, error } = await supabase
        .from('attendances')
        .insert({
          user_id: profile.id,
          type: 'karyawan',
          status,
          date: today,
        })
        .select()
        .single();

      if (error) throw error;

      setTodayAttendance(data);
      setHistory([data, ...history]);
      toast.success(`Absensi ${status} berhasil dicatat!`);
    } catch (error: any) {
      toast.error(error.message || 'Gagal merekam absensi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="pb-4 border-b border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Absensi Mandiri</h1>
        <p className="text-gray-500 font-medium mt-1">Lakukan absensi harian untuk laporan kehadiran karyawan.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-black text-gray-900">Status Hari Ini</h2>
              </div>
              <div className="text-sm font-bold text-gray-400">
                {format(new Date(), 'EEEE, dd MMMM', { locale: id })}
              </div>
            </div>

            {todayAttendance ? (
              <div className="flex flex-col items-center justify-center py-10 bg-green-50 rounded-2xl border border-green-100">
                <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
                <h3 className="text-2xl font-black text-green-900">Sudah Absen</h3>
                <p className="text-green-600 font-bold mt-2 uppercase tracking-widest text-xs">
                  Status: {todayAttendance.status} • {format(new Date(todayAttendance.created_at), 'HH:mm')} WIB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    Pastikan Anda berada di lingkungan sekolah atau lokasi kerja yang ditentukan.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <button
                    disabled={loading}
                    onClick={() => handleAttendance('hadir')}
                    className="w-full bg-primary text-white py-4 rounded-xl font-black hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
                  >
                    Hadir Sekarang
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      disabled={loading}
                      onClick={() => handleAttendance('izin')}
                      className="bg-orange-100 text-orange-600 py-4 rounded-xl font-black hover:bg-orange-200 transition-all"
                    >
                      Izin
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => handleAttendance('sakit')}
                      className="bg-blue-100 text-blue-600 py-4 rounded-xl font-black hover:bg-blue-200 transition-all"
                    >
                      Sakit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-900 p-8 rounded-3xl text-white">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" /> Informasi Penting
            </h3>
            <ul className="space-y-3 text-sm text-gray-400 font-medium">
              <li className="flex gap-2">
                <span className="text-primary font-black">•</span>
                Absen masuk dilakukan paling lambat pukul 07:30 WIB.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-black">•</span>
                Keterlambatan akan tercatat secara sistematis.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-black">•</span>
                Gunakan menu Izin/Sakit jika berhalangan hadir.
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col h-full">
           <div className="flex items-center gap-3 mb-8">
              <History className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black text-gray-900">Riwayat Terakhir</h2>
           </div>

           <div className="flex-1 space-y-4">
              {history.length > 0 ? (
                history.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="text-sm font-black text-gray-900">
                        {format(new Date(record.date), 'dd MMM yyyy', { locale: id })}
                      </p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                        Pukul {format(new Date(record.created_at), 'HH:mm')} WIB
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      record.status === 'hadir' ? 'bg-green-100 text-green-600' :
                      record.status === 'izin' ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {record.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-400 font-medium">
                  Belum ada riwayat absensi.
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
