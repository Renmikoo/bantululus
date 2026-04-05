import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    id: "01",
    title: "Web Development",
    subtitle: "Aplikasi & Landing Page Cepat, Modern, dan Skalabel.",
    description: "Kami tidak hanya membuat website, kami membangun ekosistem digital. Dari Company Profile yang elegan hingga Sistem Informasi (Web App) kompleks untuk Skripsi/Tugas Akhir Anda dengan teknologi terkini.",
    features: ["React & Next.js Framework", "Tailwind CSS Styling", "Database Setup (SQL/NoSQL)", "Deployment & Hosting Setup", "Bebas Revisi Minor (Bug Fix)"],
  },
  {
    id: "02",
    title: "Academic Writing",
    subtitle: "Riset Mendalam, Anti Plagiasi, Lulus Tepat Waktu.",
    description: "Layanan konsultasi dan penyusunan karya tulis ilmiah. Kami menjamin orisinalitas setiap kalimat dengan pengecekan Turnitin premium. Fokus pada kualitas argumen dan format yang sesuai dengan panduan kampus Anda.",
    features: ["Penyusunan Bab 1 - 5 Skripsi", "Jurnal Nasional & Internasional", "Parafrase Cek Turnitin", "Pembuatan PPT Sidang", "Laporan PKL"],
  },
  {
    id: "03",
    title: "Data Analysis",
    subtitle: "Mengubah Angka Mentah Menjadi Kesimpulan Valid.",
    description: "Olah data statistik tidak perlu membuat pusing. Kami bantu memproses data kuesioner atau sekunder Anda menggunakan software standar industri untuk memastikan hipotesis Anda terjawab secara ilmiah dan akurat.",
    features: ["SPSS & SmartPLS", "Analisis Regresi & Korelasi", "Uji Validitas & Reliabilitas", "Interpretasi Hasil Bab 4", "Revisi Hasil Output (Jika Ada)"],
  }
];

export default function ServicesDetail() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll ke paling atas saat halaman pertama kali dibuka
    window.scrollTo(0, 0);

    // Setup Lenis Smooth Scroll
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Animasi Intro (Teks muncul dari bawah)
    gsap.fromTo(".service-title-anim", 
      { y: 100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.2 }
    );

    // Animasi Fade-in untuk setiap list layanan saat di-scroll
    const serviceBlocks = gsap.utils.toArray('.service-block');
    serviceBlocks.forEach((block) => {
      gsap.fromTo(block, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 80%",
          }
        }
      );
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-zinc-50 min-h-screen font-sans text-black selection:bg-blue-600 selection:text-white">
      
      {/* HEADER NAVBAR (Sederhana untuk halaman dalam) */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 mix-blend-difference text-white flex justify-between items-center pointer-events-none">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold tracking-[0.2em] pointer-events-auto hover:-translate-x-2 transition-transform">
          <ArrowLeft size={20} /> KEMBALI
        </Link>
        <div className="text-sm font-black tracking-[0.3em]">BANTULULUS</div>
      </header>

      {/* HERO SECTION SERVICES */}
      <section className="pt-40 pb-20 px-6 md:px-12 bg-black text-white rounded-b-3xl md:rounded-b-[4rem] overflow-hidden">
        <div className="max-w-6xl mx-auto mt-20">
          <p className="text-zinc-400 text-sm font-bold tracking-[0.3em] uppercase mb-8 service-title-anim">Ekosistem Layanan Kami</p>
          <h1 className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-[0.85] service-title-anim">
            SOLUSI <span className="font-light italic text-zinc-500">TEKNIS</span> <br/>& AKADEMIS.
          </h1>
        </div>
      </section>

      {/* CONTENT: STICKY LAYOUT */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col w-full border-t border-zinc-300">
          
          {servicesData.map((service, index) => (
            <div key={index} className="service-block flex flex-col md:flex-row py-16 md:py-24 border-b border-zinc-300 gap-12 md:gap-0">
              
              {/* Kolom Kiri: Sticky Title */}
              <div className="md:w-5/12 flex flex-col relative">
                <div className="md:sticky md:top-32">
                  <span className="text-zinc-400 font-mono text-2xl mb-4 block">{service.id}</span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-6">
                    {service.title}
                  </h2>
                </div>
              </div>

              {/* Kolom Kanan: Detail Deskripsi */}
              <div className="md:w-7/12 flex flex-col">
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-6 italic text-zinc-600">
                  "{service.subtitle}"
                </h3>
                <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-light mb-12">
                  {service.description}
                </p>

                {/* List Fitur / Keunggulan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                      <CheckCircle2 size={24} className="text-blue-500 shrink-0" />
                      <span className="font-medium text-zinc-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Bawah Khusus Layanan Ini */}
                <div className="mt-12">
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="inline-block bg-black text-white px-8 py-4 rounded-full font-bold tracking-widest text-sm hover:bg-white-600 hover:scale-105 transition-all duration-300">
                    KONSULTASI {service.title.toUpperCase()}
                  </a>
                </div>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* SIMPLE FOOTER */}
      <footer className="bg-zinc-100 py-12 text-center text-zinc-500 text-sm font-medium border-t border-zinc-200">
        © {new Date().getFullYear()} BantuLulus. All rights reserved.
      </footer>

    </div>
  );
}