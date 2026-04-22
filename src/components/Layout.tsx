import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase, Profile } from '../lib/supabase.ts';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  GraduationCap, 
  FileBox, 
  LogOut, 
  Menu, 
  X, 
  Settings,
  ClipboardCheck,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export default function Layout() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try fetching profile from 'profiles' table (you need to create this in Supabase)
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(data);
        } else {
          // Fallback if profile doesn't exist yet
          setProfile({
            id: user.id,
            email: user.email!,
            full_name: 'User',
            role: 'guru', // Default role
            created_at: new Date().toISOString()
          });
        }
      }
    }
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logout berhasil');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/app', roles: ['admin', 'guru', 'tenaga_kependidikan'] },
    { name: 'Absensi Karyawan', icon: UserSquare2, path: '/app/absensi-karyawan', roles: ['admin', 'guru', 'tenaga_kependidikan'] },
    { name: 'Absensi Siswa', icon: ClipboardCheck, path: '/app/absensi-siswa', roles: ['admin', 'guru'] },
    { name: 'Rekap Absensi', icon: FileBox, path: '/app/rekap', roles: ['admin', 'guru'] },
    { name: 'Ujian Online', icon: BookOpen, path: '/app/ujian', roles: ['admin', 'guru', 'siswa'] }, // We can handle siswa differently
    { name: 'Data Siswa', icon: GraduationCap, path: '/app/data-siswa', roles: ['admin'] },
    { name: 'User Management', icon: Users, path: '/app/user-management', roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (!profile) return false;
    return item.roles.includes(profile.role);
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white border-r border-gray-100 shadow-sm relative z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/25">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900 leading-none">
            SMK <br /><span className="text-primary">PRIMA UNGGUL</span>
          </span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${
                  isActive 
                    ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-gray-50">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-gray-600">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{profile?.full_name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{profile?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden flex flex-col pt-20"
            >
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900"
              >
                <X className="w-7 h-7" />
              </button>
              <nav className="px-6 space-y-3">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold ${
                        isActive ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-gray-500'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 shrink-0 z-30">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-500"
          >
            <Menu className="w-7 h-7" />
          </button>
          
          <div className="flex items-center gap-2 lg:hidden">
             <GraduationCap className="w-6 h-6 text-primary" />
             <span className="font-extrabold text-sm tracking-tighter">PRIMA UNGGUL</span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors relative">
               <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></div>
               <Settings className="w-6 h-6" />
            </button>
            <button
               onClick={handleLogout}
               className="flex items-center gap-2 px-5 py-2.5 bg-gray-950 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              <LogOut className="w-4 h-4 text-primary" /> Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet context={{ profile }} />
        </main>
      </div>
    </div>
  );
}
