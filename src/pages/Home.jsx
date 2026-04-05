import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight, Globe, Mail } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Link } from 'react-router-dom'; 
import Magnetic from '../components/Magnetic';// <--- Tambahkan import ini
gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "Laporan Kerja Praktek", category: "Web App & Report", img: "https://images.unsplash.com/photo-1744051518421-1eaf2fbde680?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2tyaXBzaXxlbnwwfHwwfHx8MA%3D%3D" },
  { title: "Playzone", category: "Rental & Billing System", img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop" },
  { title: "MRP System", category: "Inventory & Kanban", img: "https://plus.unsplash.com/premium_photo-1664301904972-ddd48a790a9b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U2lzdGVtJTIwTWF0ZXJpYWwlMjBSZXF1aXJlbWVudHMlMjBQbGFubmluZ3xlbnwwfHwwfHx8MA%3D%3D" },
  { title: "Kedai Dz98", category: "Admin & Cashier Dashboard", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop" },
];
const logoVideoUrl = "/bg-video.mp4"; 

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const loadingRef = useRef(null);
  const loadingBarRef = useRef(null);
  const loadingTextRef = useRef(null);
  const heroRef = useRef(null);
  const bgImageRef = useRef(null);
  const maskLayerRef = useRef(null);
  const servicesRef = useRef(null);
  const projectListRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const horizontalTrackRef = useRef(null);
  useEffect(() => {
    // 1. SETUP LENIS SMOOTH SCROLL
    const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // 2. MOUSE PARALLAX & SCROLL BACKGROUND FOTO
    const bg = bgImageRef.current;
    let moveParallax; // Deklarasikan di luar agar bisa di-cleanup
    
    if (bg) {
      // GSAP quickTo untuk pergerakan mouse tanpa lag
      const xTo = gsap.quickTo(bg, "x", { duration: 1, ease: "power3.out" });
      const yTo = gsap.quickTo(bg, "y", { duration: 1, ease: "power3.out" });

      moveParallax = (e) => {
        // Hitung posisi mouse dari tengah layar (-0.5 sampai 0.5)
        const xMovement = (e.clientX / window.innerWidth - 0.5) * 80; // Maksimal geser 80px
        const yMovement = (e.clientY / window.innerHeight - 0.5) * 80;
        
        // Geser gambar berlawanan arah dengan mouse
        xTo(-xMovement);
        yTo(-yMovement);
      };

      window.addEventListener("mousemove", moveParallax);

      // Efek gambar turun & memudar saat discroll ke bawah
      gsap.to(bg, {
        y: 200, 
        opacity: 0, 
        scale: 1.1, // Sedikit membesar saat scroll
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // 3. ANIMASI HERO TEXT BERSUSUN
    gsap.fromTo(".hero-text-anim", 
      { y: 60, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.2 }
    );

    // ... (Logika animasi GSAP lainnya seperti Marquee & 3D text biarkan di sini) ...
    // ANIMASI GSAP
    const tl = gsap.timeline();
    let progress = { val: 0 };
    tl.to(progress, {
      val: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        if(loadingTextRef.current) loadingTextRef.current.innerText = `${Math.floor(progress.val)}%`;
        if(loadingBarRef.current) loadingBarRef.current.style.width = `${progress.val}%`;
      }
    })
    .to(loadingRef.current, { yPercent: -100, duration: 1, ease: "power4.inOut", delay: 0.2 })
    .fromTo(".hero-text-anim", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out" }, "-=0.5");

    const handleMouseMove = (e) => {
      if (!maskLayerRef.current) return;
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      gsap.to(maskLayerRef.current, { clipPath: `circle(15vw at ${x}% ${y}%)`, ease: "power2.out", duration: 0.4 });
    };
    window.addEventListener("mousemove", handleMouseMove);

    gsap.to(videoRef.current, {
      scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
      y: 200, opacity: 0, scale: 1.2
    });

    gsap.to(".marquee-text", {
      xPercent: -50, ease: "none",
      scrollTrigger: { trigger: servicesRef.current, start: "top bottom", end: "bottom top", scrub: 1 }
    });

    const track = horizontalTrackRef.current;
    if (track) {
      gsap.to(track, {
        // Menggeser kontainer ke kiri sepanjang sisa lebarnya dikurangi lebar layar
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: projectListRef.current,
          pin: true, // Menahan layar (sticky) selama animasi berjalan
          scrub: 1,  // Sinkron dengan scroll roda mouse
          end: () => "+=" + (track.scrollWidth - window.innerWidth) // Jarak scroll
        }
      });
    }
    const texts3D = gsap.utils.toArray('.text-3d');
    
    texts3D.forEach((text) => {
      // Set posisi awal teks: terlipat ke belakang 90 derajat dan tembus pandang
      gsap.fromTo(text, 
        { 
          rotationX: -90, 
          yPercent: 100, 
          opacity: 0 
        },
        {
          rotationX: 0,
          yPercent: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: text.parentElement, // Terpicu saat bungkusnya masuk layar
            start: "top 90%",           // Animasi mulai saat elemen di bawah layar
            end: "top 50%",             // Selesai saat elemen di tengah layar
            scrub: 1.5                  // Scrub: animasi maju-mundur sinkron dengan scroll
          }
        }
      );
    });

    return () => {
      // Hapus event listener saat pindah halaman
      if (moveParallax) window.removeEventListener("mousemove", moveParallax);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      // Teks meluncur naik dari bawah satu per satu
      gsap.fromTo(".menu-link-item",
        { y: 150, opacity: 0, rotationX: -30 }, // Posisi awal (tersembunyi di bawah)
        { 
          y: 0, 
          opacity: 1, 
          rotationX: 0, 
          duration: 0.8, 
          stagger: 0.1, // Jeda kemunculan antar teks
          ease: "back.out(1.2)", // Sedikit efek membal di akhir
          delay: 0.3 // Menunggu layar hitamnya turun sebentar
        }
      );
    }
  }, [isMenuOpen]);

  return (
    <div className="bg-zinc-50 min-h-screen font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white text-black">
      
      {/* LOADING SCREEN */}
      <div ref={loadingRef} className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white">
        <div ref={loadingTextRef} className="text-[15vw] font-black tracking-tighter">0%</div>
      </div>

      {/* FULLSCREEN MENU */}
      <div className={`fixed inset-0 z-[90] bg-zinc-950 text-white transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="px-6 py-8 md:p-12 flex flex-col justify-between h-full overflow-y-auto">
          
          <div className="flex justify-between items-center w-full">
            <div className="text-sm font-bold tracking-[0.3em] text-zinc-500">BANTULULUS</div>
            {/* Tombol Close dengan Efek Magnet */}
            <Magnetic>
              <button onClick={() => setIsMenuOpen(false)} className="p-4 rounded-full hover:rotate-90 bg-white/5 hover:bg-white/10 transition-all duration-300">
                <X size={32} strokeWidth={1.5} />
              </button>
            </Magnetic>
          </div>

          <div className="flex flex-col-reverse md:flex-row w-full justify-between items-end pb-8 mt-12 md:mt-0 border-b border-white/10">
            <div className="flex flex-col gap-4 mt-12 md:mt-0 text-zinc-400 w-full md:w-auto text-left text-sm uppercase tracking-widest font-medium">
              <a href="mailto:admin@bantululus.com" className="flex items-center gap-3 hover:text-white transition"><Mail size={16}/> ADMIN@BANTULULUS.COM</a>
            </div>
            <nav className="flex flex-col text-right w-full md:w-auto">
              {['HOME', 'SERVICES', 'ABOUT', 'WORK', 'CONTACT',].map((item) => {
                const targetId = item === 'HOME' ? '#home' : `#${item.toLowerCase()}`;
                return (
                  // Bungkus overflow-hidden agar teks tidak tumpah sebelum dianimasikan
                  <div key={item} className="overflow-hidden py-1">
                    <a 
                      href={targetId} 
                      onClick={() => setIsMenuOpen(false)} 
                      className="menu-link-item block text-[12vw] md:text-[7vw] font-black tracking-tighter hover:text-gray-500 hover:-translate-x-4 transition-all duration-300 leading-[0.85] pb-2 cursor-none origin-bottom"
                    >
                      {item}
                    </a>
                  </div>
                );
              })}
            </nav>
          </div>

        </div>
      </div>

      {/* HEADER NAVBAR */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] max-w-5xl z-[80] flex justify-between items-center px-6 py-4 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-full shadow-2xl">
        <div className="text-sm font-black tracking-[0.2em] text-white">BANTULULUS</div>
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-[0.15em] text-zinc-400">
          <a href="#services" className="hover:text-white transition-colors cursor-pointer">SERVICES</a>
          <a href="#work" className="hover:text-white transition-colors cursor-pointer">WORK</a>
          <a href="#about" className="hover:text-white transition-colors cursor-pointer">ABOUT</a>
          <a href="/behind-the-scenes" className="hover:text-white transition-colors cursor-pointer">BEHIND</a>
        </nav>
        <div className="flex items-center gap-4">
          <Magnetic>
            <button onClick={() => setIsMenuOpen(true)} className="flex items-center justify-center p-3 bg-zinc-800 rounded-full text-white hover:bg-zinc-700 transition-colors">
              <Menu size={20} strokeWidth={2} />
            </button>
          </Magnetic>
        </div>
      </header>

      {/* HERO SECTION DENGAN PHOTO PARALLAX */}
      <section id="home" ref={heroRef} className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
        
        {/* Background Image Container (110% agar bisa digeser mouse) */}
        <div ref={bgImageRef} className="absolute inset-[-5%] w-[110%] h-[110%] z-0 origin-center">
          {/* Ubah link src di bawah ini dengan foto pilihan Anda */}
          <img 
            src="/logo.jpg" 
            alt="BantuLulus Workspace" 
            className="w-full h-full object-cover opacity-40 filter grayscale"
          />
          {/* Efek gradasi hitam di bagian bawah agar teks lebih terbaca */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 mt-16">
          <p className="hero-text-anim text-zinc-400 text-sm md:text-base font-bold tracking-[0.4em] uppercase mb-6">
            Pusat Konsultasi IT & Riset
          </p>
          <h1 className="hero-text-anim text-[12vw] md:text-[9vw] font-black text-white leading-[0.85] tracking-tighter uppercase">
            ELEVATE <span className="text-zinc-500 font-light italic">YOUR</span><br/>ACADEMIC.
          </h1>
          <p className="hero-text-anim mt-10 text-zinc-300 text-lg md:text-xl font-light tracking-wide max-w-2xl leading-relaxed">
            Membantu Anda menuntaskan project <span className="font-semibold text-white">Kerja Praktek</span> dan <span className="font-semibold text-white">Tugas Akhir</span> dengan standar industri melalui pengembangan sistem yang modern dan akurat.
          </p>
          
          <div className="hero-text-anim mt-12 flex gap-6">
            <Magnetic>
              <a href="#services" className="px-8 py-4 border border-white/20 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 block">
                Lihat Layanan
              </a>
            </Magnetic>
          </div>
        </div>
        
        {/* ... (Elemen maskLayerRef ke bawah tetap sama persis) ... */}

        <div ref={maskLayerRef} className="absolute inset-0 bg-white-600 flex flex-col items-center justify-center text-center p-6 pointer-events-none z-20" style={{ clipPath: "circle(0px at 50% 50%)" }}>
          <div className="absolute inset-0 opacity-20 flex flex-wrap content-start text-[2.5rem] font-black uppercase overflow-hidden leading-none select-none text-black z-0">
            {Array(150).fill("BANTULULUS ACADEMIC EXCELLENCE ").join("")}
          </div>
          <h1 className="text-[10vw] font-black text-black relative z-10 leading-[0.9] tracking-tighter pt-20">
            BANTU<br/>LULUS
          </h1>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" ref={servicesRef} className="py-40 bg-black text-white relative overflow-hidden">
        <h2 className="marquee-text text-[18vw] font-black text-zinc-900/50 leading-none absolute top-10 whitespace-nowrap select-none">
          SERVICES SERVICES SERVICES 
        </h2>
        <div className="relative z-10 max-w-6xl mx-auto px-6 mt-32 flex flex-col w-full">
            <div className="group border-t border-zinc-800 hover:border-white transition-colors duration-500 py-12 flex flex-col md:flex-row justify-between md:items-center gap-8">
              <div className="flex gap-8 md:w-1/2">
                <span className="text-zinc-600 font-mono text-xl group-hover:text-blue-500">01</span>
                <h3 className="text-4xl md:text-5xl font-light group-hover:italic transition-all">Web <span className="font-black">Dev</span></h3>
              </div>
              <p className="text-zinc-400 md:w-1/3 text-lg font-light leading-relaxed group-hover:text-zinc-200">Pembuatan Landing Page, Web App, dan sistem manajemen.</p>
            </div>
            <div className="group border-y border-zinc-800 hover:border-white transition-colors duration-500 py-12 flex flex-col md:flex-row justify-between md:items-center gap-8">
              <div className="flex gap-8 md:w-1/2">
                <span className="text-zinc-600 font-mono text-xl group-hover:text-blue-500">02</span>
                <h3 className="text-4xl md:text-5xl font-light group-hover:italic transition-all">Academic <span className="font-black">Writing</span></h3>
              </div>
              <p className="text-zinc-400 md:w-1/3 text-lg font-light leading-relaxed group-hover:text-zinc-200">Bimbingan penyusunan skripsi, laporan, dan artikel ilmiah.</p>
            </div>
            <div className="group border-t border-zinc-800 hover:border-white transition-colors duration-500 py-12 flex flex-col md:flex-row justify-between md:items-center gap-8">
              <div className="flex gap-8 md:w-1/2">
                <span className="text-zinc-600 font-mono text-xl group-hover:text-blue-500">03</span>
                <h3 className="text-4xl md:text-5xl font-light group-hover:italic transition-all">DATA <span className="font-black">ANALYSYS</span></h3>
              </div>
              <p className="text-zinc-400 md:w-1/3 text-lg font-light leading-relaxed group-hover:text-zinc-200">Mengubah Angka Mentah Menjadi Kesimpulan Valid.</p>
            </div>
            <div className="relative z-10 max-w-6xl mx-auto px-6 mt-16 flex justify-center">
          <Link to="/services" className="inline-flex items-center gap-3 border border-white/30 px-10 py-5 rounded-full font-bold tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-300">
            LIHAT DETAIL LAYANAN KAMI <ArrowUpRight size={20} />
          </Link>
        </div>
        </div>
      </section>

      {/* ================= WORK / PROJECTS HORIZONTAL SCROLL ================= */}
      <section id="work" ref={projectListRef} className="bg-zinc-50 h-screen flex items-center relative overflow-hidden">
        
        {/* Kontainer Jalur Horizontal */}
        <div ref={horizontalTrackRef} className="flex gap-12 md:gap-24 px-6 md:px-[10vw] w-max items-center h-full">
          {projects.map((proj, idx) => (
            <div key={idx} className="project-panel w-[85vw] md:w-[55vw] flex flex-col gap-6 shrink-0 group">
              
              {/* Pembungkus Gambar dengan Efek Hover */}
              <div className="w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-xl bg-zinc-200 shadow-xl relative cursor-pointer">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                  src={proj.img} 
                  alt={proj.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" 
                />
              </div>

              {/* Teks Deskripsi */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-2 px-2">
                <h3 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter uppercase leading-none">
                  {proj.title}
                </h3>
                <p className="text-lg text-zinc-500 font-medium italic pb-1">
                  {proj.category}
                </p>
              </div>

            </div>
          ))}
        </div>
      </section>
      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="py-32 px-6 bg-white border-y border-zinc-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
          <div className="md:w-5/12 flex flex-col justify-between">
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase">
              Lebih Dari <br/><span className="text-zinc-400">Sekadar</span> Jasa.
            </h3>
            <p className="mt-8 text-lg text-zinc-500 font-medium max-w-sm">
              Kami menggabungkan keahlian teknis tingkat tinggi di bidang IT dengan ketelitian akademis murni untuk memastikan setiap proyek, skripsi, dan aplikasi berjalan sempurna.
            </p>
          </div>
          
          <div className="md:w-7/12">
            {/* Gambar ini akan berwarna hitam putih, dan memunculkan warna saat di-hover */}
            <div className="aspect-[4/3] w-full bg-zinc-100 overflow-hidden rounded-xl shadow-inner border border-zinc-200">
              <img 
                src="/logo.jpg" 
                alt="BantuLulus Workspace" 
                className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition duration-1000" 
              />
            </div>
          </div>
        </div>
      </section>
      <section className="relative min-h-[80vh] bg-zinc-950 text-white flex flex-col items-center justify-center overflow-hidden border-t border-zinc-900" style={{ perspective: "1000px" }}>
        <div className="flex flex-col items-center text-[10vw] md:text-[8vw] font-black tracking-tighter leading-[0.85] uppercase">
          {/* Bungkus dengan overflow-hidden agar teks seolah muncul dari dalam tanah */}
          <div className="overflow-hidden py-2">
            <div className="text-3d origin-bottom">ELEVATE</div>
          </div>
          <div className="overflow-hidden py-2">
            <div className="text-3d origin-bottom text-zinc-500 italic font-light">YOUR</div>
          </div>
          <div className="overflow-hidden py-2">
            <div className="text-3d origin-bottom">ACADEMIC</div>
          </div>
          <div className="overflow-hidden py-2">
            <div className="text-3d origin-bottom text-gray-600">JOURNEY.</div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT / FOOTER SECTION ================= */}
      <section id="contact" className="bg-black text-white pt-40 pb-12 flex flex-col items-center justify-center text-center overflow-hidden">
        <p className="text-2xl md:text-4xl font-light max-w-4xl leading-tight mb-20 px-6 text-zinc-400">
          "Let's build a memorable & inspiring <span className="text-white font-medium italic">academic journey</span> together."
        </p>
        
        <div className="flex gap-12 mb-32 text-sm uppercase tracking-widest font-bold">
          <Magnetic>
            <a href="https://www.instagram.com/jokitugasbybantululus/" className="hover:text-purple-800 transition block">
              Instagram
            </a>
          </Magnetic>
          <Magnetic>
            <a href="https://wa.me/6287728967883" target="_blank" rel="noreferrer" className="hover:text-green-500 transition block">
              WhatsApp
            </a>
          </Magnetic>
        </div>

        <h1 className="text-[12vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-200 to-zinc-600 leading-none w-full border-t border-zinc-900 pt-10">
          BANTULULUS.
        </h1>
      </section>
    </div>
  );
}