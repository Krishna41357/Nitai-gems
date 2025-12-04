import React, { useState, useEffect } from 'react';

const ExchangeProgramBanner = () => {
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/banners?type=exchange`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setBannerData(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching exchange banner:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default content if API fails or no data
  const defaultContent = {
    heading: "Exchange Program",
    subtitle: "Trusted by 2.8M+ families",
    description: "Get the best value for your old jewelry",
    buttonText: "Learn More",
    buttonLink: "/exchange-program",
    backgroundImage: null
  };

  const content = bannerData || defaultContent;

  if (loading) {
    return (
      <section className="h-[300px] bg-gradient-to-r from-[#5C1F1F] to-[#8B3A3A] animate-pulse" />
    );
  }

  return (
    <section 
      className="relative h-[300px] overflow-hidden"
      style={{
        backgroundImage: content.backgroundImage 
          ? `url(${content.backgroundImage})` 
          : 'linear-gradient(to right, #5C1F1F, #8B3A3A)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {content.heading}
          </h2>
          <p className="text-xl text-white/90 mb-2">
            {content.subtitle}
          </p>
          <p className="text-lg text-white/80 mb-6">
            {content.description}
          </p>
          <button
            onClick={() => window.location.href = content.buttonLink}
            className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#C5A028] transition-colors"
          >
            {content.buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExchangeProgramBanner;