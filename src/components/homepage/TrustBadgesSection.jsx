import React, { useEffect, useRef, useState } from 'react';
import { Hammer, Heart, Award, RefreshCw } from 'lucide-react';
import './category-bg.css';
import './trust-badges.css';

const TrustBadgesSection = () => {
  const badges = [
    { Icon: Hammer, title: 'Quality\nCraftsmanship' },
    { Icon: Heart,   title: 'Ethically\nSourced' },
    { Icon: Award,   title: '100%\nTransparency' },
    { Icon: RefreshCw, title: 'Lifetime\nMaintenance' }
  ];

  const gridRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-12 category-bg-section">
      <div className="category-bg" aria-hidden="true">
        <div className="category-gradient" />
        <div className="ornament orn-1" />
        <div className="ornament orn-2" />
        <div className="ornament orn-3" />
        <div className="ornament orn-4" />
        <div className="light-sheen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* glass card */}
        <div
          className="rounded-2xl border border-white/30 bg-white/12 backdrop-blur-md
                      shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]
                      px-6 py-10"
        >
          {/* two-column layout */}
          <div className="flex items-center gap-6">
            {/* LEFT 30 % – vertically centred */}
            <div className="w-[30%] flex items-center justify-center h-full">
              <div className="text-center">
                <h1 className="text-3xl font-serif font-bold text-[#D4AF37]">
                  Nitai Gems
                </h1>
                <p className="text-sm text-gray-700 italic mt-1">
                  “Where every stone tells a story”
                </p>
              </div>
            </div>

            {/* vertical divider – full height */}
            <div className="self-stretch w-px bg-red-900" />

            {/* RIGHT 70 % */}
            <div className="w-[70%]">
              {/* header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold font-serif tracking-wide text-black">
                  Our Assurance
                </h2>
                <p className="text-gray-700 text-sm mt-1">
                  Crafted by experts, cherished by you
                </p>
              </div>

              {/* badges */}
              <div ref={gridRef} className={`trust-badges-grid ${inView ? 'in-view' : ''}`}>
                {badges.map(({ Icon, title }, idx) => (
                  <div
                    key={idx}
                    className="trust-badge"
                    style={{ ['--i']: idx }}
                  >
                    <div className="icon-wrap">
                      <div className="glow" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(212,175,55,0.5), rgba(212,175,55,0.05))' }} />
                      <Icon className="icon z-10" />
                    </div>
                    <h3 className="text-center whitespace-pre-line">{title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;