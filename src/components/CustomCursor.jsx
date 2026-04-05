import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, { opacity: 0 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" });

    const moveCircle = (e) => {
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseLeaveWindow = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.3 });
    };

    window.addEventListener("mousemove", moveCircle);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('button') || target.closest('a')) {
        // MENGUBAH WIDTH DAN HEIGHT LANGSUNG (Bukan Scale) AGAR TETAP TAJAM
        gsap.to(cursor, { 
          width: "72px", 
          height: "72px", 
          borderWidth: "1.5px", 
          duration: 0.4, 
          ease: "power2.out" 
        });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('button') || target.closest('a')) {
        // KEMBALIKAN KE UKURAN AWAL (24px)
        gsap.to(cursor, { 
          width: "24px", 
          height: "24px", 
          borderWidth: "1px", 
          duration: 0.3, 
          ease: "power2.out" 
        });
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCircle);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      /* Hapus w-6 dan h-6 dari class, pindahkan ke style agar bisa dianimasikan GSAP */
      className="fixed top-0 left-0 border border-zinc-200 rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2 origin-center"
      style={{ width: "24px", height: "24px", willChange: "width, height, transform, opacity" }}
    ></div>
  );
}