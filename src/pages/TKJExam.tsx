import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Timer, 
  Trophy, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const questions = [
  { id: 1, question: "Topologi jaringan yang menggunakan hub sebagai pusat adalah...", options: ["Bus", "Star", "Ring", "Mesh"], answer: 1 },
  { id: 2, question: "Alat yang berfungsi untuk menghubungkan beberapa segmen jaringan melalui protokol OSI layer 3 adalah...", options: ["Hub", "Switch", "Router", "Repeater"], answer: 2 },
  { id: 3, question: "Standard kabel UTP yang umum digunakan untuk jaringan ethernet adalah tipe...", options: ["RJ-11", "RJ-45", "BNC", "LC"], answer: 1 },
  { id: 4, question: "Berapakah jumlah host maksimum pada subnet mask 255.255.255.0?", options: ["254", "256", "128", "512"], answer: 0 },
  { id: 5, question: "Perintah CLI untuk mengecek konektivitas antar komputer adalah...", options: ["ipconfig", "ping", "tracert", "netstat"], answer: 1 },
  { id: 6, question: "Lapisan OSI yang menangani pengiriman data bit melalui media transmisi fisik adalah...", options: ["Data Link", "Physical", "Network", "Transport"], answer: 1 },
  { id: 7, question: "Alamat IP 192.168.1.1 termasuk dalam kelas...", options: ["A", "B", "C", "D"], answer: 2 },
  { id: 8, question: "Protocol yang berfungsi memberikan IP secara otomatis ke client adalah...", options: ["DNS", "HTTP", "DHCP", "FTP"], answer: 2 },
  { id: 9, question: "Port default untuk layanan HTTP adalah...", options: ["21", "22", "80", "443"], answer: 2 },
  { id: 10, question: "Perangkat yang berfungsi menyaring dan mengontrol traffic jaringan masuk/keluar disebut...", options: ["Gateway", "Proxy", "Firewall", "Bridge"], answer: 2 },
  { id: 11, question: "Kabel Fiber Optik menggunakan media transmisi berupa...", options: ["Listrik", "Udara", "Cahaya", "Air"], answer: 2 },
  { id: 12, question: "Manakah yang merupakan OS open source?", options: ["Windows 10", "MacOS", "Linux", "iOS"], answer: 2 },
  { id: 13, question: "Subnetting berfungsi untuk...", options: ["Mempercepat akses internet", "Membagi jaringan menjadi lebih kecil", "Menambah jumlah user", "Mengamankan data"], answer: 1 },
  { id: 14, question: "Dalam peng kabelan UTP T568B, urutan kabel pertama adalah...", options: ["Putih-Hijau", "Putih-Coklat", "Putih-Orange", "Biru"], answer: 2 },
  { id: 15, question: "Teknologi yang memungkinkan satu IP publik digunakan oleh banyak IP privat adalah...", options: ["VLAN", "NAT", "VPN", "QoS"], answer: 1 },
  { id: 16, question: "Hardware yang berfungsi mengolah sinyal digital menjadi analog dan sebaliknya adalah...", options: ["Modem", "Sound Card", "VGA Card", "Processor"], answer: 0 },
  { id: 17, question: "Protocol yang digunakan untuk remote server secara aman (encrypted) adalah...", options: ["Telnet", "SSH", "SNMP", "RDP"], answer: 1 },
  { id: 18, question: "Domain Name System (DNS) berfungsi untuk...", options: ["Mengirim email", "Me-resolusi nama domain ke IP", "Mengatur bandwidth", "Memblokir situs"], answer: 1 },
  { id: 19, question: "Topologi yang memiliki tingkat redundansi tertinggi adalah...", options: ["Bus", "Star", "Ring", "Mesh"], answer: 3 },
  { id: 20, question: "RAM adalah singkatan dari...", options: ["Random Access Memory", "Read Access Memory", "Real Action Memory", "Recent Access Memory"], answer: 0 },
];

export default function TKJExam() {
  const [currentStep, setCurrentStep] = useState<'start' | 'exam' | 'result'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [score, setScore] = useState(0);

  const startExam = () => {
    setCurrentStep('exam');
    setScore(0);
    setUserAnswers(new Array(questions.length).fill(-1));
    setCurrentQuestion(0);
    toast.success('Ujian dimulai. Semoga beruntung!');
  };

  const handleAnswer = (optionIdx: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = optionIdx;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishExam();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishExam = () => {
    let calculatedScore = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === questions[idx].answer) {
        calculatedScore += 5; // 5 points per question, total 100
      }
    });
    setScore(calculatedScore);
    setCurrentStep('result');
    toast.success('Ujian selesai!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {currentStep === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-xl text-center space-y-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <GraduationCap className="w-40 h-40 transform rotate-12" />
            </div>
            
            <div className="space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary shadow-xl shadow-primary/10">
                <BrainCircuit className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Ujian Kompetensi TKJ</h1>
              <p className="text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
                Uji kemampuan teknik komputer dan jaringan anda dengan 20 soal standar industri.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
               <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <Timer className="w-6 h-6 text-primary mb-3" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Durasi</p>
                  <p className="font-extrabold text-gray-900">30 Menit</p>
               </div>
               <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <BookOpen className="w-6 h-6 text-primary mb-3" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Soal</p>
                  <p className="font-extrabold text-gray-900">20 Butir</p>
               </div>
               <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 col-span-2 lg:col-span-1">
                  <Trophy className="w-6 h-6 text-primary mb-3" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Passing</p>
                  <p className="font-extrabold text-gray-900">75 Poin</p>
               </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex gap-4 text-left">
               <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
               <p className="text-xs text-orange-700 font-medium leading-relaxed">
                 Dilarang membuka tab baru atau mencari jawaban di internet selama ujian berlangsung. Sistem akan mencatat aktivitas mencurigakan.
               </p>
            </div>

            <button
              onClick={startExam}
              className="bg-primary text-white w-full py-5 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Mulai Ujian Sekarang <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}

        {currentStep === 'exam' && (
          <motion.div
            key="exam"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <header className="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-black">
                     {currentQuestion + 1}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Progress</p>
                    <p className="text-sm font-bold text-gray-900">{currentQuestion + 1} dari {questions.length} Soal</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <Timer className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm font-black text-gray-700">29:45</span>
               </div>
            </header>

            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-10 min-h-[500px] flex flex-col justify-center">
               <h2 className="text-2xl font-black text-gray-900 leading-tight">
                  {questions[currentQuestion].question}
               </h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`p-6 rounded-3xl text-left border-4 transition-all font-bold group relative ${
                        userAnswers[currentQuestion] === idx
                          ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10'
                          : 'border-gray-50 bg-gray-50 hover:border-primary/20 hover:bg-white text-gray-600'
                      }`}
                    >
                      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full transition-all ${
                        userAnswers[currentQuestion] === idx ? 'bg-primary' : 'bg-transparent'
                      }`}></div>
                      <span className="inline-block w-8 text-xs font-black opacity-30 group-hover:opacity-100">{String.fromCharCode(65 + idx)}.</span>
                      {option}
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex items-center justify-between gap-6">
               <button
                 onClick={prevQuestion}
                 disabled={currentQuestion === 0}
                 className="flex-1 bg-white border border-gray-100 text-gray-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 active:scale-95 shadow-sm"
               >
                 <ArrowLeft className="w-5 h-5" /> Sebelumnya
               </button>
               <button
                 onClick={nextQuestion}
                 className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 active:scale-95"
               >
                 {currentQuestion === questions.length - 1 ? 'Selesaikan Ujian' : 'Selanjutnya'} <ArrowRight className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        )}

        {currentStep === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-xl text-center space-y-10"
          >
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-green-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Keren! Ujian Selesai</h2>
              <p className="text-gray-500 font-medium italic">Anda telah menyelesaikan Ujian Kompetensi TKJ.</p>
            </div>

            <div className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100 inline-block px-20">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Skor Akhir Anda</p>
               <h3 className="text-7xl font-black text-primary leading-none">{score}</h3>
               <p className="text-xs font-bold text-gray-500 mt-4">Poin Terkumpul</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-6">
               <button 
                 onClick={() => setCurrentStep('start')}
                 className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all active:scale-95"
               >
                 Review Jawaban
               </button>
               <button 
                 onClick={() => setCurrentStep('start')}
                 className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
               >
                 Kembali ke Dashboard
               </button>
            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
               <CheckCircle2 className="w-4 h-4 text-green-500" /> Hasil ujian dikirim otomatis ke Database Guru
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
