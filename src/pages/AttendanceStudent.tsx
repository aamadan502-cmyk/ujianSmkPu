import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase, Profile, Student, Attendance } from '../lib/supabase.ts';
import { toast } from 'react-hot-toast';
import { 
  ClipboardCheck, 
  Search, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Loader2,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AttendanceStudent() {
  const { profile } = useOutletContext<{ profile: Profile }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedClass, setSelectedClass] = useState('XII TKJ 1');
  const [records, setRecords] = useState<Record<string, 'hadir' | 'sakit' | 'izin' | 'alfa'>>({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchStudentsByClass();
    checkExistingAttendance();
  }, [selectedClass]);

  async function fetchStudentsByClass() {
    setFetching(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('class', selectedClass)
      .order('name');
    
    if (data) {
      setStudents(data);
      // Initialize records with 'hadir'
      const initial: Record<string, 'hadir' | 'sakit' | 'izin' | 'alfa'> = {};
      data.forEach(s => initial[s.id] = 'hadir');
      setRecords(initial);
    }
    setFetching(false);
  }

  async function checkExistingAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('attendances')
      .select('student_id, status')
      .eq('date', today)
      .eq('type', 'siswa')
      .in('student_id', students.map(s => s.id));
    
    if (data && data.length > 0) {
      const existing: Record<string, 'hadir' | 'sakit' | 'izin' | 'alfa'> = { ...records };
      data.forEach(d => existing[d.student_id!] = d.status);
      setRecords(existing);
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }

  const handleStatusChange = (studentId: string, status: 'hadir' | 'sakit' | 'izin' | 'alfa') => {
    if (isSaved) return;
    setRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const attendanceData = students.map(s => ({
      student_id: s.id,
      type: 'siswa',
      status: records[s.id],
      date: today,
      created_by: profile.id
    }));

    try {
      const { error } = await supabase.from('attendances').insert(attendanceData);
      if (error) throw error;
      toast.success('Absensi siswa berhasil disimpan!');
      setIsSaved(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Absensi Siswa</h1>
          <p className="text-gray-500 font-medium mt-1">Lakukan rekap kehadiran siswa di kelas hari ini.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 min-w-[200px] justify-between group cursor-pointer relative">
            <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
               <Users className="w-4 h-4 text-primary" /> {selectedClass}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
            <select 
               className="absolute inset-0 opacity-0 cursor-pointer"
               value={selectedClass}
               onChange={e => setSelectedClass(e.target.value)}
            >
               <option>XII TKJ 1</option>
               <option>XII TKJ 2</option>
               <option>XII DKV</option>
               <option>XII AKL</option>
            </select>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
         <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <div className="flex items-center gap-3">
               <Calendar className="w-5 h-5 text-primary" />
               <h3 className="font-black text-gray-900">{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}</h3>
            </div>
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" /> Data Tersimpan
              </span>
            )}
         </div>

         {fetching ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
               <Loader2 className="w-12 h-12 text-primary animate-spin" />
               <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Menyiapkan Daftar Siswa...</p>
            </div>
         ) : students.length > 0 ? (
           <>
             <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-gray-50">
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Hadir</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Izin</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Sakit</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Alfa</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {students.map((student) => (
                       <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-5">
                             <p className="text-sm font-bold text-gray-900">{student.name}</p>
                             <p className="text-[10px] text-gray-400 font-bold tracking-widest mt-1">NIS: {student.nis}</p>
                          </td>
                          {['hadir', 'izin', 'sakit', 'alfa'].map((status) => (
                            <td key={status} className="px-8 py-5 text-center">
                               <button
                                 disabled={isSaved}
                                 onClick={() => handleStatusChange(student.id, status as any)}
                                 className={`w-6 h-6 rounded-full border-2 transition-all mx-auto flex items-center justify-center p-1 ${
                                   records[student.id] === status
                                     ? status === 'hadir' ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20' :
                                       status === 'izin' ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/20' :
                                       status === 'sakit' ? 'bg-blue-500 border-blue-500 shadow-lg shadow-blue-500/20' :
                                       'bg-primary border-primary shadow-lg shadow-primary/20'
                                     : 'border-gray-200 hover:border-primary/30'
                                 }`}
                               >
                                 {records[student.id] === status && (
                                   <div className="w-full h-full bg-white rounded-full"></div>
                                 )}
                               </button>
                            </td>
                          ))}
                       </tr>
                     ))}
                  </tbody>
               </table>
             </div>
             {!isSaved && (
               <div className="p-10 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex gap-10">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-bold text-gray-600">Hadir: {Object.values(records).filter(v => v === 'hadir').length}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm font-bold text-gray-600">Alfa: {Object.values(records).filter(v => v === 'alfa').length}</span>
                     </div>
                  </div>
                  <button
                    disabled={loading}
                    onClick={handleSaveAttendance}
                    className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ClipboardCheck className="w-5 h-5" />}
                    Simpan Absensi Kelas
                  </button>
               </div>
             )}
           </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
               <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-gray-300" />
               </div>
               <h3 className="text-xl font-bold text-gray-900">Belum ada siswa di kelas ini</h3>
               <p className="text-gray-500 max-w-xs mt-2 font-medium">Silakan hubungi Admin untuk menambahkan data siswa ke kelas {selectedClass}.</p>
            </div>
         )}
      </div>
    </div>
  );
}
