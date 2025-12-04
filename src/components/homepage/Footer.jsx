import React from 'react';
import {
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Diamond,
  Sparkles,
} from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const quick = [
    { name: 'Collections', url: '#' },
    { name: 'New Arrivals', url: '#' },
    { name: 'Bespoke', url: '#' },
    { name: 'Certificates', url: '#' },
    { name: 'Care Guide', url: '#' },
  ];

  const service = [
    { name: 'Track Order', url: '#' },
    { name: 'Shipping Info', url: '#' },
    { name: '30-Day Returns', url: '#' },
    { name: 'Size Guide', url: '#' },
    { name: 'Contact', url: '#' },
  ];

  const socials = [
    { icon: Instagram, url: '#' },
    { icon: Facebook, url: '#' },
    { icon: Twitter, url: '#' },
    { icon: Youtube, url: '#' },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-red-950 via-red-900 to-black text-white">
      {/* subtle bg decoration */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-400/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand with QR */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <Diamond className="w-10 h-10 text-red-400" />
              <span className="text-4xl lg:text-5xl font-serif font-bold tracking-wide text-white drop-shadow-lg">
                Nitai Gems
              </span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed mb-6">
              Curating timeless brilliance since 1984. Authenticity certified.
            </p>
            
            {/* QR Code Placeholder */}
            <div className="inline-block">
              <div className="bg-white p-4 rounded-lg shadow-2xl border-4 border-red-400">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 border-4 border-red-900 rounded-sm flex items-center justify-center">
                      <span className="text-xs text-gray-600 font-medium">QR Code</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-300 mt-2 text-center">Scan to connect</p>
            </div>
          </div>

          {/* Quick */}
      <div>
            <h3 className="flex items-center gap-2 text-base uppercase tracking-widest text-white mb-5 font-bold">
              <Sparkles className="w-5 h-5" /> Quick
            </h3>
            <ul className="space-y-3 text-white">
              {quick.map((l) => (
                <li key={l.name}>
                  <a
                    href={l.url}
                    className="relative inline-block group text-base hover:text-yellow-400 transition-colors duration-300"
                  >
                    {l.name}
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div>
            <h3 className="flex items-center gap-2 text-base uppercase tracking-widest text-white mb-5 font-bold">
              <Sparkles className="w-5 h-5" /> Service
            </h3>
            <ul className="space-y-3 text-white">
              {service.map((l) => (
                <li key={l.name}>
                  <a
                    href={l.url}
                    className="relative inline-block group text-base hover:text-yellow-400 transition-colors duration-300"
                  >
                    {l.name}
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="flex items-center gap-2 text-base uppercase tracking-widest text-white mb-5 font-bold">
              <Sparkles className="w-5 h-5" /> Reach Us
            </h3>
            <div className="space-y-3 text-base">
              
              <a
                href="tel:+916350288120"
                className="flex items-center gap-3 text-white hover:text-yellow-400 transition-colors duration-300"
              >
                <Phone className="w-5 h-5 text-red-400" />
                +91 63502 88120
              </a>
              <a
                href="mailto:agarwal14krishna@gmail.com"
                className="flex items-center gap-3 text-white hover:text-yellow-400 transition-colors duration-300"
              >
                <Mail className="w-5 h-5 text-red-400" />
                agarwal14krishna@gmail.com
              </a>
            </div>

            {/* Social rings */}
            <div className="flex gap-4 mt-6">
              {socials.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.url}
                    aria-label="social"
                    className="relative group"
                  >
                    <div className="w-10 h-10 rounded-full border border-red-400/40 bg-white/5 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-yellow-400/20 group-hover:border-yellow-400/60">
                      <Icon className="w-5 h-5 text-white group-hover:text-yellow-400 transition-colors duration-300" />
                    </div>
                    <span className="absolute inset-0 rounded-full border border-yellow-400 opacity-0 group-hover:opacity-100 animate-ping" />
                  </a>
                 
                );
              })}
            </div>
          </div>
        </div>
      

        {/* Bottom strip */}
        <div className="mt-14 pt-6 border-t border-white/10 text-center text-xs text-gray-300">
          © {year} Nitai Gems. Crafted for eternity.
        </div>
      </div>
    </footer>
  );
};

export default Footer;