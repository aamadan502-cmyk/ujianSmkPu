import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { School, GraduationCap, Users, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';

const majors = [
  { name: 'Teknik Komputer & Jaringan (TKJ)', icon: '💻', desc: 'Mempelajari instalasi, perbaikan, dan perawatan komputer serta jaringan.' },
  { name: 'Desain Komunikasi Visual (DKV)', icon: '🎨', desc: 'Mempelajari seni visual, desain grafis, dan multimedia kreatif.' },
  { name: 'Akuntansi (AK)', icon: '📊', desc: 'Fokus pada pencatatan transaksi, audit, dan manajemen keuangan.' },
  { name: 'Broadcasting (BC)', icon: '🎥', desc: 'Mempelajari produksi konten televisi, radio, dan media digital.' },
  { name: 'Manajemen Perkantoran (MPLB)', icon: '🏢', desc: 'Mempelajari administrasi bisnis, layanan logistik, dan perkantoran.' },
  { name: 'Bisnis Digital (BD)', icon: '🌐', desc: 'Fokus pada pemasaran online, e-commerce, dan kewirausahaan digital.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-8 h-8 text-primary" />
            <span className="text-xl font-extrabold tracking-tight">SMK PRIMA UNGGUL</span>
          </div>
          <Link
            to="/login"
            className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
          >
            Login Sistem
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4 tracking-wide uppercase">
                Welcome to SMK Prima Unggul
              </span>
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                Mencetak Generasi <br />
                <span className="text-primary underline decoration-primary/30 decoration-4 underline-offset-8">Unggul & Kompeten</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                Platform digital terintegrasi untuk manajemen absensi dan layanan pendidikan modern di SMK Prima Unggul.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-dark shadow-xl shadow-primary/25 transition-all hover:-translate-y-1"
                >
                  Masuk ke Dashboard <ChevronRight className="w-5 h-5" />
                </Link>
                <a
                  href="#jurusan"
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Lihat Jurusan
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 lg:mt-0 relative"
            >
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                alt="Students studying"
                className="rounded-3xl shadow-2xl border-4 border-white transform hover:rotate-1 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-black text-primary mb-1">6+</div>
            <div className="text-sm font-medium text-gray-500">Program Keahlian</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-primary mb-1">1k+</div>
            <div className="text-sm font-medium text-gray-500">Siswa Aktif</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-primary mb-1">50+</div>
            <div className="text-sm font-medium text-gray-500">Guru Berpengalaman</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-primary mb-1">100%</div>
            <div className="text-sm font-medium text-gray-500">Kesiapan Kerja</div>
          </div>
        </div>
      </section>

      {/* Jurusan Section */}
      <section id="jurusan" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Program Keahlian Kami</h2>
            <p className="text-lg text-gray-600 italic">
              Pilihan jurusan unggulan yang didesain sesuai kebutuhan industri masa kini.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {majors.map((major, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left">{major.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{major.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{major.desc}</p>
                <div className="flex items-center gap-2 text-primary text-sm font-bold">
                  Selengkapnya <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <School className="w-10 h-10 text-primary" />
              <span className="text-2xl font-black tracking-tighter">SMK PRIMA UNGGUL</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Membangun masa depan gemilang melalui pendidikan yang berkualitas dan teknologi yang terintegrasi.
              Berlokasi di pusat pendidikan Indonesia.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Menu Cepat</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/" className="hover:text-primary">Profil Sekolah</Link></li>
              <li><a href="#jurusan" className="hover:text-primary">Program Keahlian</a></li>
              <li><Link to="/login" className="hover:text-primary">Login Guru/Siswa</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Kontak</h4>
            <ul className="space-y-4 text-gray-400">
              <li>Jl. Pendidikan No. 123</li>
              <li>admin@smkprimaunggul.sch.id</li>
              <li>+62 123 4567 890</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SMK Prima Unggul. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
