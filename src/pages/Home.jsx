import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight, Globe, Mail } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Link } from 'react-router-dom'; 
import Magnetic from '../components/Magnetic';
gsap.registerPlugin(ScrollTrigger);

const projects = [ { title: "Laporan Kerja Praktek & PPL", category: "Web App & Report", img: "/1.png" }, { title: "Revisi Laporan", category: "Kerja Praktek & Program Perangkat Lunak", img: "2.png" }, { title: "IASBandara", category: "Web App Absence", img: "/absensi.png" }, { title: "MRP SYSTEM & E-Library", category: "Web App", img: "/web.png" }, ];  

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const loadingRef = useRef(null);
  const loadingBarRef = useRef(null);
  const loadingTextRef = useRef(null);
  const heroRef = useRef(null);
  const bgImageRef = useRef(null);
  const maskLayerRef = useRef(null);
  const servicesRef = useRef(null);
  const pricingRef = useRef(null);
  const projectListRef = useRef(null);
  const resultSectionRef = useRef(null); // Ref baru untuk section HASIL
  const horizontalTrackRef = useRef(null);

  useEffect(() => {
    // 1. SETUP LENIS SMOOTH SCROLL
    const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // 2. MOUSE PARALLAX & SCROLL BACKGROUND FOTO
    const bg = bgImageRef.current;
    let moveParallax; 
    
    if (bg) {
      const xTo = gsap.quickTo(bg, "x", { duration: 1, ease: "power3.out" });
      const yTo = gsap.quickTo(bg, "y", { duration: 1, ease: "power3.out" });

      moveParallax = (e) => {
        const xMovement = (e.clientX / window.innerWidth - 0.5) * 80; 
        const yMovement = (e.clientY / window.innerHeight - 0.5) * 80;
        xTo(-xMovement);
        yTo(-yMovement);
      };

      window.addEventListener("mousemove", moveParallax);

      gsap.to(bg, {
        y: 200, 
        opacity: 0, 
        scale: 1.1, 
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

    // ANIMASI GSAP LOADING
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

    gsap.to(".marquee-text", {
      xPercent: -50, ease: "none",
      scrollTrigger: { trigger: servicesRef.current, start: "top bottom", end: "bottom top", scrub: 1 }
    });

    // --- ANIMASI SCROLL INTERAKTIF UNTUK PRICING SECTION ---
    if (pricingRef.current) {
      const tlPricing = gsap.timeline({
        scrollTrigger: {
          trigger: pricingRef.current,
          start: "top 75%",
        }
      });

      tlPricing.fromTo(".pricing-text-anim",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out" }
      )
      .fromTo(".pricing-card-anim",
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
        "-=0.4" 
      )
      .fromTo(".pricing-btn-anim",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );
    }

    // --- ANIMASI ENTRANCE UNTUK WORK / PROJECTS SECTION ---
    if (projectListRef.current) {
      gsap.fromTo(".project-card-entrance",
        { opacity: 0, y: 150, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.2, 
          ease: "power4.out",
          scrollTrigger: {
            trigger: projectListRef.current,
            start: "top 75%", 
          }
        }
      );
    }

    // --- ANIMASI INTERAKTIF UNTUK SECTION HASIL ---
    if (resultSectionRef.current) {
      gsap.fromTo(".result-anim",
        { opacity: 0, y: 100, scale: 0.95 }, // Posisi awal: di bawah, transparan, agak kecil
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15, // Muncul berurutan
          ease: "power3.out",
          scrollTrigger: {
            trigger: resultSectionRef.current,
            start: "top 60%", // Terpicu saat masuk 60% layar
          }
        }
      );
    }
    // -------------------------------------------------

    // Animasi Horizontal Scroll
    const track = horizontalTrackRef.current;
    if (track) {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: projectListRef.current,
          pin: true, 
          scrub: 1,  
          end: () => "+=" + (track.scrollWidth - window.innerWidth) 
        }
      });
    }

    // Animasi Teks 3D Lipat (Berlaku untuk semua .text-3d di halaman)
    const texts3D = gsap.utils.toArray('.text-3d');
    texts3D.forEach((text) => {
      gsap.fromTo(text, 
        { rotationX: -90, yPercent: 100, opacity: 0 },
        {
          rotationX: 0, yPercent: 0, opacity: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: text.parentElement,
            start: "top 90%",          
            end: "top 50%",            
            scrub: 1.5                  
          }
        }
      );
    });

    return () => {
      if (moveParallax) window.removeEventListener("mousemove", moveParallax);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      gsap.fromTo(".menu-link-item",
        { y: 150, opacity: 0, rotationX: -30 }, 
        { 
          y: 0, opacity: 1, rotationX: 0, duration: 0.8, 
          stagger: 0.1, ease: "back.out(1.2)", delay: 0.3 
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
            <Magnetic>
              <button onClick={() => setIsMenuOpen(false)} className="p-4 rounded-full hover:rotate-90 bg-white/5 hover:bg-white/10 transition-all duration-300">
                <X size={32} strokeWidth={1.5} />
              </button>
            </Magnetic>
          </div>

          <div className="flex flex-col-reverse md:flex-row w-full justify-between items-end pb-8 mt-12 md:mt-0 border-b border-white/10">
            <div className="flex flex-col gap-4 mt-12 md:mt-0 text-zinc-400 w-full md:w-auto text-left text-sm uppercase tracking-widest font-medium">
              <a href="https://www.instagram.com/jokitugasbybantululus/" className="flex items-center gap-3 hover:text-white transition"><Mail size={16}/> @jokitugasbybantululus</a>
            </div>
            <nav className="flex flex-col text-right w-full md:w-auto">
              {['HOME', 'LAYANAN', 'PROJECT', 'TENTANGKAMI', 'PRICELIST', 'CONTACT'].map((item) => {
                let targetId = '';
                let isRoute = false;

                if (item === 'HOME') targetId = '#home';
                else if (item === 'PRICELIST') { targetId = '/pricelist'; isRoute = true; }
                else targetId = `#${item.toLowerCase()}`;

                return (
                  <div key={item} className="overflow-hidden py-1">
                    {isRoute ? (
                      <Link 
                        to={targetId} 
                        onClick={() => setIsMenuOpen(false)} 
                        className="menu-link-item block text-[12vw] md:text-[7vw] font-black tracking-tighter hover:text-gray-500 hover:-translate-x-4 transition-all duration-300 leading-[0.85] pb-2 cursor-none origin-bottom"
                      >
                        {item}
                      </Link>
                    ) : (
                      <a 
                        href={targetId} 
                        onClick={() => setIsMenuOpen(false)} 
                        className="menu-link-item block text-[12vw] md:text-[7vw] font-black tracking-tighter hover:text-gray-500 hover:-translate-x-4 transition-all duration-300 leading-[0.85] pb-2 cursor-none origin-bottom"
                      >
                        {item}
                      </a>
                    )}
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
          <a href="#services" className="hover:text-white transition-colors cursor-pointer">LAYANAN</a>
          <a href="#work" className="hover:text-white transition-colors cursor-pointer">PROJECT</a>
          <a href="#about" className="hover:text-white transition-colors cursor-pointer">TENTANG KAMI</a>
          <Link to="/pricelist" className="hover:text-white transition-colors cursor-pointer">PRICELIST</Link>
          <Link to="/behind-the-scenes" className="hover:text-white transition-colors cursor-pointer">BEHIND</Link>
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
        
        <div ref={bgImageRef} className="absolute inset-[-5%] w-[110%] h-[110%] z-0 origin-center">
          <img 
            src="/logo.jpg" 
            alt="BantuLulus Workspace" 
            className="w-full h-full object-cover opacity-40 filter grayscale"
          />
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
        
        <div ref={maskLayerRef} className="absolute inset-0 bg-white-600 flex flex-col items-center justify-center text-center p-6 pointer-events-none z-20" style={{ clipPath: "circle(0px at 50% 50%)" }}>
          <div className="absolute inset-0 opacity-20 flex flex-wrap content-start text-[2.5rem] font-black uppercase overflow-hidden leading-none select-none text-black z-0">
            {Array(150).fill("BANTULULUS ACADEMIC EXCELLENCE ").join("")}
          </div>
          <h1 className="text-[10vw] font-black text-black relative z-10 leading-[0.9] tracking-tighter pt-20">
            BANTU<br/>LULUS
          </h1>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" ref={servicesRef} className="py-40 bg-black text-white relative overflow-hidden">
        <h2 className="marquee-text text-[18vw] font-black text-zinc-900/50 leading-none absolute top-10 whitespace-nowrap select-none">
          LAYANAN LAYANAN LAYANAN 
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
                <h3 className="text-4xl md:text-5xl font-light group-hover:italic transition-all">DATA <span className="font-black">ANALYSIS</span></h3>
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

      {/* ================= PRICING PREVIEW SECTION ================= */}
      <section ref={pricingRef} className="py-32 px-6 md:px-[10vw] bg-zinc-950 text-white border-t border-zinc-900 flex flex-col items-center justify-center text-center overflow-hidden">
        <h3 className="pricing-text-anim text-sm font-bold tracking-[0.3em] text-zinc-500 uppercase mb-8">
          TRANSPARENT PRICING
        </h3>
        <h2 className="pricing-text-anim text-[10vw] md:text-[6vw] font-black tracking-tighter leading-[0.9] uppercase mb-10">
          KUALITAS PREMIUM, <br/>
          <span className="text-zinc-600 italic font-light">HARGA RASIONAL.</span>
        </h2>
        <p className="pricing-text-anim text-zinc-400 text-lg md:text-xl font-light max-w-2xl mb-16">
          Berbagai pilihan layanan dari Joki Tugas Akademik hingga Pembuatan Website dan Pengelolaan Media Sosial, disesuaikan dengan kebutuhanmu.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16">
          {['Akademik', 'Digital & Kreatif', 'Tambahan'].map((cat, i) => (
            <div key={i} className="pricing-card-anim border border-zinc-800 rounded-2xl p-8 hover:bg-zinc-900 hover:border-zinc-600 transition-all duration-500 flex flex-col justify-between items-start text-left group cursor-pointer">
              <div>
                <span className="text-zinc-600 font-mono text-sm mb-4 block">0{i + 1}</span>
                <h4 className="text-2xl font-bold mb-4 group-hover:italic transition-all">{cat}</h4>
                <p className="text-zinc-500 text-sm font-light">Solusi tuntas untuk kebutuhan {cat.toLowerCase()} kamu. Dikerjakan rapi dan tepat waktu.</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-btn-anim">
          <Magnetic>
            <Link to="/pricelist" className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-bold tracking-widest text-sm hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              LIHAT DETAIL HARGA <ArrowUpRight size={20} />
            </Link>
          </Magnetic>
        </div>
      </section>

      {/* ================= WORK / PROJECTS HORIZONTAL SCROLL ================= */}
      <section id="work" ref={projectListRef} className="bg-zinc-50 h-screen flex items-center relative overflow-hidden">
        <div ref={horizontalTrackRef} className="flex gap-12 md:gap-24 px-6 md:px-[10vw] w-max items-center h-full">
          {projects.map((proj, idx) => (
            <div key={idx} className="project-card-entrance project-panel w-[85vw] md:w-[55vw] flex flex-col gap-6 shrink-0 group">
              <div className="w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-xl bg-zinc-200 shadow-xl relative cursor-pointer">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                  src={proj.img} 
                  alt={proj.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" 
                />
              </div>
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
            <div className="aspect-[4/3] w-full bg-zinc-100 overflow-hidden rounded-xl shadow-inner border border-zinc-200">
              <img 
                src="/4.jpg" 
                alt="BantuLulus Workspace" 
                className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition duration-1000" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION HASIL / BUKTI KUALITAS (REPLACEMENT) ================= */}
      <section ref={resultSectionRef} className="relative py-40 min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center overflow-hidden border-t border-zinc-900" style={{ perspective: "1000px" }}>
        
        {/* Background Animation (Aurora/Orbs) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-zinc-800/40 blur-[100px] md:blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-blue-900/20 blur-[100px] md:blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }}></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-zinc-800/30 blur-[100px] md:blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>
        </div>

        {/* 3D Animated Headline */}
        <div className="relative z-10 flex flex-col items-center text-[10vw] md:text-[8vw] font-black tracking-tighter leading-[0.85] uppercase mb-16 text-center">
          <div className="overflow-hidden py-2">
            <div className="text-3d origin-bottom">BUKTIKAN</div>
          </div>
          <div className="overflow-hidden py-2">
            <div className="text-3d origin-bottom text-zinc-500 italic font-light">KUALITAS</div>
          </div>
          <div className="overflow-hidden py-2">
            <div className="text-3d origin-bottom">HASIL</div>
          </div>
          <div className="overflow-hidden py-2">
            <div className="text-3d origin-bottom text-gray-600">KAMI.</div>
          </div>
        </div>

        {/* Paragraf Pendukung & Kartu Statistik */}
        <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto px-6 text-center">
          
          <p className="result-anim text-zinc-400 text-lg md:text-2xl font-light mb-20 max-w-3xl leading-relaxed">
            Bukan sekadar janji, kami memberikan hasil nyata. Setiap baris kode, kalimat laporan, dan *slide* presentasi dikerjakan dengan standar tertinggi. Kami memastikan tugas Anda tuntas, rapi, dan siap meraih nilai maksimal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {/* Stat Card 1 */}
            <div className="result-anim border border-zinc-800/50 rounded-2xl p-8 bg-zinc-900/30 backdrop-blur-sm hover:bg-zinc-800/50 transition-colors duration-500">
              <h4 className="text-4xl md:text-5xl font-black text-white mb-3">99<span className="text-zinc-500">%</span></h4>
              <p className="text-zinc-400 text-sm tracking-widest uppercase font-bold">ACC / Kelulusan</p>
            </div>
            
            {/* Stat Card 2 */}
            <div className="result-anim border border-zinc-800/50 rounded-2xl p-8 bg-zinc-900/30 backdrop-blur-sm hover:bg-zinc-800/50 transition-colors duration-500">
              <h4 className="text-4xl md:text-5xl font-black text-white mb-3">100<span className="text-zinc-500">%</span></h4>
              <p className="text-zinc-400 text-sm tracking-widest uppercase font-bold">Bebas Plagiasi</p>
            </div>
            
            {/* Stat Card 3 */}
            <div className="result-anim border border-zinc-800/50 rounded-2xl p-8 bg-zinc-900/30 backdrop-blur-sm hover:bg-zinc-800/50 transition-colors duration-500">
              <h4 className="text-4xl md:text-5xl font-black text-white mb-3">24<span className="text-zinc-500">/7</span></h4>
              <p className="text-zinc-400 text-sm tracking-widest uppercase font-bold">Support Revisi</p>
            </div>

            {/* Stat Card 4 */}
            <div className="result-anim border border-zinc-800/50 rounded-2xl p-8 bg-zinc-900/30 backdrop-blur-sm hover:bg-zinc-800/50 transition-colors duration-500">
              <h4 className="text-4xl md:text-5xl font-black text-white mb-3">20<span className="text-zinc-500">+</span></h4>
              <p className="text-zinc-400 text-sm tracking-widest uppercase font-bold">Project Selesai</p>
            </div>
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