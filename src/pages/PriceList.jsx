import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Lenis from 'lenis';
import Magnetic from '../components/Magnetic'; 

const PriceList = () => {
  const [activeTab, setActiveTab] = useState('AKADEMIK');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const contentRef = useRef(null);

  // Data Layanan
  const services = {
    AKADEMIK: [
      { title: "Joki Tugas Mata Kuliah", desc: "Cepat, rapi, dan sesuai instruksi dosen. Solusi tugas mingguanmu.", price: "Rp 49.000", prefix: "Mulai" },
      { title: "Joki Makalah", desc: "Bantuan dari nol sampai siap kumpul. Nilai bagus tanpa stress.", price: "Rp 99.000", prefix: "Mulai" },
      { title: "Joki PPT Sidang", desc: "Slide clean, jelas, dan meyakinkan. Bikin dosen impressed.", price: "Rp 4.900", prefix: "/ Hal" },
      { title: "Tugas Akhir / Skripsi", desc: "Bantuan dari awal sampai ACC. Lulus lebih cepat tanpa drama.", price: "Rp 799.000", prefix: "Mulai" }
    ],
    DIGITAL: [
      { title: "Pembuatan Website", desc: "Desain modern, cepat, dan siap pakai untuk berbagai kebutuhan.", price: "GRATIS", prefix: "Konsul" },
      { title: "Kelola Media Sosial", desc: "Bantuan dari konten sampai growth. Naikkan engagement brand kamu.", price: "Rp 89.000", prefix: "Mulai" },
      { title: "Desain Konten", desc: "Desain standout & aesthetic untuk menarik lebih banyak perhatian.", price: "Rp 49.000", prefix: "Mulai" }
    ],
    TAMBAHAN: [
      { title: "Paket Lengkap TA", desc: "Include Skripsi, PPT Sidang, dan Revisi tanpa batas. (Best Seller)", price: "Rp 1.499.000", prefix: "Mulai" },
      { title: "Paket Lengkap KP/PPL", desc: "Include Laporan, PPT Sidang, dan Revisi tanpa batas. (Best Seller)", price: "Rp 999.000", prefix: "Mulai" },
      { title: "Laporan PKL", desc: "Laporan rapi dan tersusun sesuai dengan standar format kampus.", price: "Rp 149.000", prefix: "Mulai" },
      { title: "Laporan KKN", desc: "Laporan rapi dan tersusun sesuai dengan standar format kampus.", price: "Rp 649.000", prefix: "Mulai" },
      { title: "Portofolio Digital", desc: "Tampil profesional untuk kerja & personal branding.", price: "Custom", prefix: "Harga" },
      { title: "Undangan Digital", desc: "Elegan, interaktif, dan kekinian (sudah termasuk hosting).", price: "Custom", prefix: "Harga" },
      { title: "Edit & Proofread", desc: "Perbaiki typo, struktur, dan plagiarisme agar layak ACC.", price: "Custom", prefix: "Harga" }
    ]
  };

  useEffect(() => {
    // Smooth Scroll Lenis
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    // Animasi masuk (Fade In + Slide Up)
    gsap.fromTo(".animate-up", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out" }
    );

    return () => lenis.destroy();
  }, []);

  // Animasi saat pindah tab
  useEffect(() => {
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
  }, [activeTab]);

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans selection:bg-zinc-700 selection:text-white">
      
      {/* HEADER NAVBAR */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[50%] md:w-[11%] max-w-5xl z-[50] flex justify-between items-center px-6 py-4 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-full shadow-2xl">
        <Link to="/" className="text-sm font-black tracking-[0.2em] text-white hover:text-zinc-400 transition">BANTULULUS</Link>
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-[0.15em] text-zinc-400">
        </nav>
        <div className="flex items-center gap-4">
        </div>
      </header>

      {/* FULLSCREEN MENU */}
      <div className={`fixed inset-0 z-[90] bg-zinc-950 text-white transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="px-6 py-8 md:p-12 flex flex-col justify-between h-full overflow-y-auto">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm font-bold tracking-[0.3em] text-zinc-500">BANTULULUS</div>
            <Magnetic>
              <button onClick={() => setIsMenuOpen(false)} className="p-4 rounded-full hover:rotate-90 bg-white/5 hover:bg-white/10 transition-all duration-300">
                <X size={32} strokeWidth={1.5} />
              </button>
            </Magnetic>
          </div>
          <div className="flex flex-col-reverse md:flex-row w-full justify-between items-end pb-8 mt-12 md:mt-0 border-b border-white/10">
            <nav className="flex flex-col text-right w-full md:w-auto mt-12 md:mt-0">
              {['HOME', 'PRICELIST'].map((item) => {
                const target = item === 'HOME' ? '/' : '/pricelist';
                return (
                  <div key={item} className="overflow-hidden py-1">
                    <Link to={target} onClick={() => setIsMenuOpen(false)} className="block text-[12vw] md:text-[7vw] font-black tracking-tighter hover:text-zinc-500 hover:-translate-x-4 transition-all duration-300 leading-[0.85] pb-2 uppercase">
                      {item}
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="pt-48 pb-20 px-6 md:px-[10vw]">
        <div className="max-w-5xl">
          <h1 className="animate-up text-[12vw] md:text-[8vw] font-black tracking-tighter leading-[0.85] uppercase mb-8">
            TRANSPARENT <br />
            <span className="text-zinc-600 italic font-light">PRICING.</span>
          </h1>
          <p className="animate-up text-zinc-400 text-xl md:text-2xl font-light leading-relaxed max-w-2xl">
            Tugas numpuk? Deadline melejit? <span className="text-white font-medium">Tenang, kami kerjakan untuk kamu.</span> Tinggal kirim, duduk santai, dan biarkan kami memberikan hasil terbaik.
          </p>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="px-6 md:px-[10vw] pb-32">
        <h2 className="animate-up text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase mb-12 border-b border-zinc-800 pb-4">
          MENGAPA BANTULULUS?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
          {['Tim Berpengalaman & Sesuai Bidang', 'Revisi Sampai Puas', 'Tepat Waktu & Anti Telat', '100% Original Bebas Plagiasi'].map((reason, idx) => (
            <div key={idx} className="animate-up group border-t border-zinc-800 pt-6 flex gap-6 hover:border-white transition-colors duration-500">
              <span className="text-zinc-600 font-mono text-sm">0{idx + 1}</span>
              <h3 className="text-xl md:text-2xl font-light group-hover:italic transition-all">{reason}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING INTERACTIVE TABS */}
      <section className="px-6 md:px-[10vw] pb-32 min-h-[60vh]">
        {/* Tab Header */}
        <div className="flex flex-wrap gap-8 md:gap-16 border-b border-zinc-800 pb-6 mb-12">
          {Object.keys(services).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm md:text-base font-bold tracking-[0.2em] uppercase transition-all duration-300 relative ${activeTab === tab ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              {tab}
              {/* Garis bawah aktif */}
              <span className={`absolute -bottom-[25px] left-0 h-[2px] bg-white transition-all duration-300 ${activeTab === tab ? 'w-full' : 'w-0'}`}></span>
            </button>
          ))}
        </div>

        {/* Tab Content (Daftar Harga clickable ke Instagram) */}
        <div ref={contentRef} className="flex flex-col">
          {services[activeTab].map((service, idx) => (
            <a 
              key={idx} 
              href="https://www.instagram.com/jokitugasbybantululus/"
              target="_blank"
              rel="noreferrer"
              className="group border-b border-zinc-800 hover:border-white transition-colors duration-500 py-8 md:py-12 flex flex-col md:flex-row justify-between md:items-center gap-6 cursor-pointer block"
            >
              
              <div className="md:w-1/2">
                <h3 className="text-3xl md:text-4xl font-light group-hover:italic transition-all mb-4">
                  {service.title}
                </h3>
                <p className="text-zinc-400 font-light text-lg max-w-sm group-hover:text-zinc-200 transition-colors">
                  {service.desc}
                </p>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-12 md:w-1/2">
                <div className="text-left md:text-right">
                  <span className="block text-zinc-500 text-sm font-medium tracking-widest uppercase mb-1">{service.prefix}</span>
                  <span className="text-2xl md:text-3xl font-black tracking-tight">{service.price}</span>
                </div>
                
                {/* Tombol Aksi Hover yang ikut bergerak */}
                <div className="h-14 w-14 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 shrink-0">
                  <ArrowUpRight size={24} strokeWidth={1.5} className="group-hover:rotate-45 transition-transform duration-500" />
                </div>
              </div>

            </a>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-white text-black pt-32 pb-20 px-6 md:px-[10vw] flex flex-col items-center justify-center text-center overflow-hidden rounded-t-[3rem]">
        <h2 className="text-[8vw] md:text-[6vw] font-black tracking-tighter leading-[0.85] uppercase mb-8">
          SIAP NAIK <br /> <span className="text-zinc-400 italic font-light">KELAS?</span>
        </h2>
        <p className="text-xl md:text-2xl font-light max-w-2xl mb-12 text-zinc-600">
          Slot terbatas setiap hari! Jangan tunggu deadline makin dekat. Pesan sekarang dan konsultasi gratis hari ini.
        </p>
        
        <Magnetic>
          <a href="https://www.instagram.com/jokitugasbybantululus/" target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full font-bold tracking-widest text-sm hover:scale-105 transition-transform duration-300">
            PESAN SEKARANG <ArrowRight size={20} />
          </a>
        </Magnetic>
      </section>

    </div>
  );
};

export default PriceList;