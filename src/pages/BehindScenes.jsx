import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import gsap from 'gsap';
import Lenis from 'lenis';
import Magnetic from '../components/Magnetic';

export default function BehindScenes() {
  
  useEffect(() => {
    // Pastikan halaman mulai dari paling atas
    window.scrollTo(0, 0);

    // 1. SETUP LENIS SMOOTH SCROLL KHUSUS HALAMAN INI
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. ANIMASI INTRO (Staggered Reveal)
    const tl = gsap.timeline({ delay: 0.2 });
    
    tl.fromTo(".bts-title-anim", 
      { y: 80, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out" }
    )
    .fromTo(".bts-photo-card",
      { y: 100, opacity: 0, rotationX: -15 },
      { y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.2, ease: "power3.out" },
      "-=0.5" // Mulai sedikit tumpang tindih dengan animasi teks
    );

    return () => {
      lenis.destroy();
      gsap.killTweensOf("*"); // Bersihkan animasi saat pindah halaman
    };
  }, []);

  // DATA FOTO ANDA (Sesuaikan nama file jika berbeda)
  const myPhotos = [
    { 
      url: "/bts-1.jpg", // Mengambil dari folder public/
      title: "Brainstorming Session", 
      desc: "Diskusi awal penentuan arsitektur sistem dan database." 
    },
    { 
      url: "/bts-3.jpg", 
      title: "Coding & Debugging", 
      desc: "Proses development inti dan penyusunan Bab 4." 
    },
    { 
      url: "/bts-2.jpg", 
      title: "Final Review", 
      desc: "Pengecekan akhir standar industri dan Turnitin." 
    },
  ];

  return (
    // Gunakan perspective untuk efek rotasi 3D saat foto muncul
    <div className="bg-zinc-950 min-h-screen font-sans text-white selection:bg-blue-600 selection:text-white overflow-hidden" style={{ perspective: "1000px" }}>
      
      {/* HEADER NAVBAR Sederhana */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-sm flex justify-between items-center">
        <Magnetic>
          <Link to="/" className="flex items-center gap-2 text-sm font-bold tracking-[0.2em] hover:-translate-x-2 transition-transform text-zinc-400 hover:text-white">
            <ArrowLeft size={18} /> KEMBALI
          </Link>
        </Magnetic>
        <div className="text-sm font-black tracking-[0.3em]">BANTULULUS</div>
      </header>

      {/* HERO SECTION HALAMAN BTS */}
      <section className="pt-40 pb-20 px-6 md:px-12 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="md:w-2/3">
            <div className="flex items-center gap-3 bts-title-anim mb-4">
               <Camera size={20} className="text-blue-500"/>
               <p className="text-zinc-500 text-sm font-bold tracking-[0.3em] uppercase">BEHIND THE SCENES</p>
            </div>
            <h1 className="bts-title-anim text-[10vw] md:text-[6vw] font-black tracking-tighter leading-[0.85] uppercase">
              Proses <span className="font-light italic text-zinc-600">Dibalik</span> <br/>Kesuksesan Anda.
            </h1>
          </div>
          <p className="bts-title-anim md:w-1/3 text-lg text-zinc-400 font-light leading-relaxed">
            Dedikasi tinggi dalam setiap baris kode dan setiap lembar riset. Intip bagaimana tim BantuLulus bekerja mewujudkan impian akademis Anda.
          </p>
        </div>
      </section>

      {/* BTS PHOTO GALLERY */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {myPhotos.map((photo, index) => (
            <div key={index} className="bts-photo-card flex flex-col group origin-top">
              {/* Pembungkus Gambar Editorial */}
              <div className="w-full aspect-[4/5] overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl relative mb-6">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]" 
                />
                {/* Overlay Gradasi Tipis */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>
              
              {/* Deskripsi Foto */}
              <div className="px-1 flex flex-col gap-1">
                <h3 className="text-2xl font-bold tracking-tight text-zinc-100 uppercase mt-2">
                  {photo.title}
                </h3>
                <p className="text-sm font-mono text-zinc-500 group-hover:text-blue-500 transition-colors">
                  // {photo.desc}
                </p>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* SIMPLE FOOTER */}
      <footer className="bg-black py-12 text-center text-zinc-700 text-xs font-medium border-t border-zinc-900 mt-20">
        © {new Date().getFullYear()} BantuLulus Lab. Diabadikan dengan penuh dedikasi.
      </footer>

    </div>
  );
}