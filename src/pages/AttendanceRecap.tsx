import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase, Profile } from '../lib/supabase.ts';
import { 
  FileBox, 
  Download, 
  Calendar, 
  Users, 
  UserSquare2, 
  Search,
  Filter,
  BarChart3,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AttendanceRecap() {
  const { profile } = useOutletContext<{ profile: Profile }>();
  const [activeTab, setActiveTab] = useState<'karyawan' | 'siswa'>('karyawan');
  const [recapData, setRecapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: format(new Date(), 'yyyy-MM-01'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchRecap();
  }, [activeTab, dateRange]);

  async function fetchRecap() {
    setLoading(true);
    let query = supabase
      .from('attendances')
      .select(`
        *,
        profiles:user_id(full_name, role),
        students:student_id(name, nis, class)
      `)
      .eq('type', activeTab)
      .gte('date', dateRange.start)
      .lte('date', dateRange.end)
      .order('date', { ascending: false });

    const { data, error } = await query;
    if (data) setRecapData(data);
    setLoading(false);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Rekapitulasi Absensi</h1>
          <p className="text-gray-500 font-medium mt-1">Laporan lengkap kehadiran Karyawan dan Siswa SMK Prima Unggul.</p>
        </div>
        <button className="bg-gray-950 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95">
          <Download className="w-5 h-5 text-primary" /> Eksport PDF/Excel
        </button>
      </header>

      {/* Tabs */}
      <div className="flex bg-white p-2 rounded-3xl border border-gray-100 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('karyawan')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm transition-all ${
            activeTab === 'karyawan' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <UserSquare2 className="w-5 h-5" /> Absensi Karyawan
        </button>
        <button
          onClick={() => setActiveTab('siswa')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm transition-all ${
            activeTab === 'siswa' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Users className="w-5 h-5" /> Absensi Siswa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
             <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" /> Filter Laporan
             </h3>
             <div className="space-y-4">
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tanggal Mulai</label>
                   <input 
                     type="date" 
                     className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl outline-none focus:border-primary text-sm font-bold"
                     value={dateRange.start}
                     onChange={e => setDateRange({...dateRange, start: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tanggal Selesai</label>
                   <input 
                     type="date" 
                     className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl outline-none focus:border-primary text-sm font-bold"
                     value={dateRange.end}
                     onChange={e => setDateRange({...dateRange, end: e.target.value})}
                   />
                </div>
             </div>
             
             <div className="pt-6 border-t border-gray-50">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-sm font-bold text-gray-900">Statistik Cepat</h4>
                   <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Hadir</span>
                      <span className="text-xs font-black text-green-600">{recapData.filter(d => d.status === 'hadir').length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Izin/Sakit</span>
                      <span className="text-xs font-black text-blue-600">{recapData.filter(d => d.status === 'izin' || d.status === 'sakit').length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Alfa</span>
                      <span className="text-xs font-black text-primary">{recapData.filter(d => d.status === 'alfa').length}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Recap Table */}
        <div className="md:col-span-3">
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                   <Loader2 className="w-12 h-12 text-primary animate-spin" />
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Memproses Laporan...</p>
                </div>
              ) : recapData.length > 0 ? (
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-gray-50/50 border-b border-gray-50">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanggal</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                            {activeTab === 'siswa' && <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kelas</th>}
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {recapData.map((record) => (
                           <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-bold text-gray-900">{format(new Date(record.date), 'dd/MM/yyyy')}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                 <p className="text-sm font-bold text-gray-900">
                                   {activeTab === 'siswa' ? record.students?.name : record.profiles?.full_name}
                                 </p>
                                 <p className="text-[10px] text-gray-400 font-bold tracking-widest mt-1 uppercase">
                                   {activeTab === 'siswa' ? `NIS: ${record.students?.nis}` : record.profiles?.role}
                                 </p>
                              </td>
                              <td className="px-8 py-5">
                                 <div className={`mx-auto w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    record.status === 'hadir' ? 'bg-green-100 text-green-600' :
                                    record.status === 'izin' ? 'bg-orange-100 text-orange-600' :
                                    record.status === 'sakit' ? 'bg-blue-100 text-blue-600' :
                                    'bg-primary/10 text-primary'
                                 }`}>
                                    {record.status}
                                 </div>
                              </td>
                              {activeTab === 'siswa' && (
                                <td className="px-8 py-5">
                                   <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-500">{record.students?.class}</span>
                                </td>
                              )}
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                   <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                      <FileBox className="w-10 h-10 text-gray-300" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900">Laporan Kosong</h3>
                   <p className="text-gray-500 max-w-xs mt-2 font-medium">Belum ada data absensi untuk rentang tanggal yang dipilih.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
