import { useOutletContext } from 'react-router-dom';
import { Profile } from '../lib/supabase.ts';
import { motion } from 'motion/react';
import { 
  Users, 
  Calendar, 
  ClipboardCheck, 
  BookOpen, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  School,
  AlertTriangle
} from 'lucide-react';

export default function Dashboard() {
  const { profile } = useOutletContext<{ profile: Profile }>();

  const stats = [
    { name: 'Total Siswa', value: '1,248', icon: Users, color: 'bg-blue-500', trend: '+4% vs last month' },
    { name: 'Absensi Hari Ini', value: '98.2%', icon: ClipboardCheck, color: 'bg-green-500', trend: '+1.2% higher' },
    { name: 'Ujian Aktif', value: '12', icon: BookOpen, color: 'bg-purple-500', trend: '3 scheduled today' },
    { name: 'Rata-rata Nilai', value: '84.5', icon: TrendingUp, color: 'bg-orange-500', trend: '+2.1% improvement' },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Selamat datang kembali, {profile?.full_name}!</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-gray-700">
            {new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date())}
          </span>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg shadow-${stat.color.split('-')[1]}-500/30 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-xs font-black text-green-600 bg-green-50 rounded-full px-2 py-1">
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend.split(' ')[0]}
              </div>
            </div>
            <p className="text-sm font-bold text-gray-500 mb-1">{stat.name}</p>
            <h3 className="text-2xl font-black text-gray-900 leading-none">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Supabase Guide */}
        {!import.meta.env.VITE_SUPABASE_URL && (
          <div className="lg:col-span-3 bg-red-50 p-8 rounded-3xl border-2 border-primary/20 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
               <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="flex-1">
               <h3 className="text-xl font-bold text-gray-900">Konfigurasi Supabase Belum Lengkap</h3>
               <p className="text-sm text-gray-600 mt-1 font-medium">
                 Silakan masukkan <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code> di panel **Secrets** AI Studio untuk mengaktifkan database dan autentikasi.
               </p>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" /> Aktivitas Terbaru
            </h2>
            <button className="text-sm font-bold text-primary hover:underline">Lihat Semua</button>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="p-6 flex items-center gap-4 border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500 shrink-0">
                    {i}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">Siswa {i} telah melakukan absen</p>
                    <p className="text-xs text-gray-400 mt-1">Hadir pukul 07:{10 + i * 5} WIB • Kelas XII TKJ 1</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase">
                    Success
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <School className="w-6 h-6 text-primary" /> Program Jurusan
          </h2>
          <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <h4 className="font-black text-primary mb-2">SMK PRIMA UNGGUL</h4>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Fasilitas modern dengan 6 jurusan unggulan siap mencetak tenaga profesional siap kerja.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['TKJ', 'DKV', 'AK', 'BC', 'MPLB', 'BD'].map(j => (
                <span key={j} className="px-3 py-1 bg-white border border-primary/20 rounded-lg text-xs font-bold text-primary">
                  {j}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-3xl text-white relative overflow-hidden group">
            <h4 className="font-black text-primary mb-2">Pusat Bantuan</h4>
            <p className="text-sm text-gray-400 font-medium mb-6">
              Mengalami kendala sistem? Hubungi tim IT Support kami.
            </p>
            <button className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-all shadow-xl">
              Kontak Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
