import { useState, useEffect, FormEvent } from 'react';
import { supabase, Profile } from '../lib/supabase.ts';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Loader2,
  X,
  ShieldCheck,
  UserCheck,
  Mail,
  MoreVertical,
  Filter,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'guru'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    // Note: To list all users in a real app, you'd usually query a 'profiles' table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setUsers(data);
    setLoading(false);
  }

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    toast.loading('Mendaftarkan user baru...', { id: 'create' });
    
    try {
      // In a real Supabase environment without the admin SDK, you can't create users for others easily 
      // without an edge function. For this demo, we'll demonstrate the UI logic.
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            role: formData.role
          }
        }
      });

      if (authError) throw authError;

      // In real scenario, a trigger on the database would create the 'profile'
      // For this mock, let's manually insert if trigger isn't setup
      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert([{
          id: authData.user.id,
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role as any
        }]);
        // if (profileError) throw profileError;
      }

      toast.success('User berhasil dibuat!', { id: 'create' });
      fetchUsers();
      setIsModalOpen(false);
      setFormData({ email: '', password: '', full_name: '', role: 'guru' });
    } catch (error: any) {
      toast.error(error.message, { id: 'create' });
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manajemen Pengguna</h1>
          <p className="text-gray-500 font-medium mt-1">Kelola akun Admin, Guru, dan Karyawan SMK Prima Unggul.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" /> Daftarkan User
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Cari user berdasarkan nama atau email..."
            className="w-full bg-white border border-gray-100 px-12 py-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-white border border-gray-100 p-3.5 rounded-2xl text-gray-500 hover:text-primary transition-all shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
           <Filter className="w-5 h-5" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         {loading ? (
           <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Sinkronisasi Data...</p>
           </div>
         ) : filteredUsers.length > 0 ? (
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Informasi Pengguna</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Akses Role</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanggal Dibuat</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Tindakan</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {filteredUsers.map((user) => (
                   <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                     <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-gray-950 flex items-center justify-center text-primary font-black uppercase shadow-xl group-hover:scale-105 transition-transform">
                            {user.full_name.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{user.full_name}</p>
                            <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1">
                               <Mail className="w-3 h-3" /> {user.email}
                            </p>
                         </div>
                       </div>
                     </td>
                     <td className="px-8 py-6 text-center">
                       <div className={`mx-auto w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${
                          user.role === 'admin' ? 'bg-red-50 text-primary border-primary/20' :
                          user.role === 'guru' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          'bg-orange-50 text-orange-600 border-orange-200'
                       }`}>
                          {user.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          {user.role.replace('_', ' ')}
                       </div>
                     </td>
                     <td className="px-8 py-6">
                       <span className="text-xs font-bold text-gray-500">
                         {new Date(user.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                       </span>
                     </td>
                     <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-1">
                         <button className="p-3 text-gray-400 hover:bg-white hover:text-primary rounded-xl transition-all"><Edit2 className="w-5 h-5" /></button>
                         <button className="p-3 text-gray-400 hover:bg-white hover:text-primary rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                         <button className="p-3 text-gray-400 hover:bg-white hover:text-gray-950 rounded-xl transition-all"><MoreVertical className="w-5 h-5" /></button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         ) : (
           <div className="py-24 text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                <Users className="w-10 h-10" />
             </div>
             <p className="text-gray-500 font-black tracking-tight text-lg">Tidak ada data pengguna</p>
             <p className="text-gray-400 text-sm mt-1">Daftarkan user baru untuk melihat daftar di sini.</p>
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
               className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[2.5rem] p-10 z-[70] shadow-2xl space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight">Pendaftaran User Baru</h2>
                   <p className="text-gray-400 text-sm font-medium mt-1">Lengkapi form untuk mendaftarkan akun baru.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 border border-gray-100 rounded-xl"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                       <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                       <input 
                          required
                          type="text" 
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm"
                          value={formData.full_name}
                          onChange={e => setFormData({...formData, full_name: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Sekolah</label>
                       <input 
                          required
                          type="email" 
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password Awal</label>
                       <input 
                          required
                          type="password" 
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm"
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                       />
                    </div>
                    <div className="col-span-2">
                       <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Hak Akses (Role)</label>
                       <div className="flex gap-4">
                          {['admin', 'guru', 'tenaga_kependidikan'].map((role) => (
                             <button
                                key={role}
                                type="button"
                                onClick={() => setFormData({...formData, role})}
                                className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                                   formData.role === role 
                                   ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25' 
                                   : 'bg-white border-gray-100 text-gray-400 hover:border-primary/30'
                                }`}
                             >
                                {role.replace('_', ' ')}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
                 
                 <button className="w-full bg-gray-950 text-white py-5 rounded-2xl font-black shadow-2xl shadow-gray-950/20 hover:bg-gray-800 transition-all active:scale-95 text-lg">
                    Daftarkan Sekarang
                 </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
