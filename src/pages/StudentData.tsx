import { useState, useEffect, FormEvent } from 'react';
import { supabase, Student } from '../lib/supabase.ts';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  GraduationCap,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    nis: '',
    name: '',
    class: 'XII TKJ 1'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name');
    
    if (data) setStudents(data);
    setLoading(false);
  }

  const handleAddStudent = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([formData])
        .select()
        .single();
      
      if (error) throw error;
      
      setStudents([...students, data]);
      setIsModalOpen(false);
      setFormData({ nis: '', name: '', class: 'XII TKJ 1' });
      toast.success('Data siswa berhasil ditambahkan');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data siswa ini?')) return;
    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      setStudents(students.filter(s => s.id !== id));
      toast.success('Data siswa dihapus');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nis.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Data Siswa</h1>
          <p className="text-gray-500 font-medium mt-1">Kelola data seluruh siswa SMK Prima Unggul.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" /> Tambah Siswa
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Cari nama atau NIS..."
            className="w-full bg-white border border-gray-100 px-12 py-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-white border border-gray-100 p-3.5 rounded-2xl text-gray-500 hover:text-primary hover:border-primary/20 transition-all shadow-sm">
           <Filter className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
         {loading ? (
           <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Memuat Data...</p>
           </div>
         ) : filteredStudents.length > 0 ? (
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">NIS</th>
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</th>
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Kelas</th>
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {filteredStudents.map((student) => (
                   <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                     <td className="px-6 py-5">
                       <span className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{student.nis}</span>
                     </td>
                     <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black uppercase text-xs">
                            {student.name.charAt(0)}
                         </div>
                         <span className="text-sm font-bold text-gray-700">{student.name}</span>
                       </div>
                     </td>
                     <td className="px-6 py-5">
                       <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">
                         {student.class}
                       </span>
                     </td>
                     <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                         <button 
                           onClick={() => handleDelete(student.id)}
                           className="p-2 text-gray-400 hover:text-primary transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         ) : (
           <div className="py-24 text-center">
             <GraduationCap className="w-16 h-16 text-gray-200 mx-auto mb-4" />
             <p className="text-gray-500 font-bold">Data siswa tidak ditemukan</p>
           </div>
         )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl p-8 z-[70] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Tambah Siswa Baru</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 border border-gray-100 rounded-xl"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">NIS (Nomor Induk Siswa)</label>
                    <input 
                       required
                       type="text" 
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-sm"
                       placeholder="Contoh: 2024001"
                       value={formData.nis}
                       onChange={e => setFormData({...formData, nis: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                    <input 
                       required
                       type="text" 
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-sm"
                       placeholder="Contoh: Ahmad Budiman"
                       value={formData.name}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Kelas</label>
                    <select 
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-sm appearance-none"
                       value={formData.class}
                       onChange={e => setFormData({...formData, class: e.target.value})}
                    >
                       <option>XII TKJ 1</option>
                       <option>XII TKJ 2</option>
                       <option>XII DKV</option>
                       <option>XII AKL</option>
                       <option>XII BC</option>
                    </select>
                 </div>
                 
                 <button className="w-full bg-primary text-white py-4 rounded-xl font-black shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95">
                    Simpan Data Siswa
                 </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
