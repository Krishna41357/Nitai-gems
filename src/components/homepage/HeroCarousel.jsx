import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Circle, CircleDot } from "lucide-react";


const HeroCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/banners`);
      if (response.ok) {
        const data = await response.json();
        const activeBanners = data
          .filter(banner => banner.isActive)
          .sort((a, b) => a.order - b.order);
        
        if (activeBanners.length > 0) {
          setBanners(activeBanners);
        } else {
          loadLocalBanners();
        }
      } else {
        loadLocalBanners();
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      loadLocalBanners();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalBanners = () => {
    const localBanners = [
      {
        id: 'local-banner-1',
        imageUrl: new URL('../media/banners/banner1.jpeg', import.meta.url).href,
        mobileImageUrl: new URL('../media/banners/banner1-mobile.jpg', import.meta.url).href,
        title: 'Exquisite Diamond Collection',
        subtitle: 'Discover timeless elegance',
        ctaText: 'Shop Now',
        ctaLink: '/collections',
        order: 1,
        isActive: true,
      },
      {
        id: 'local-banner-2',
        imageUrl: new URL('../media/banners/banner2.jpg', import.meta.url).href,
        mobileImageUrl: new URL('../media/banners/banner2-mobile.jpg', import.meta.url).href,
        title: 'New Arrivals',
        subtitle: 'Trending diamond jewellery',
        ctaText: 'Explore',
        ctaLink: '/new-arrivals',
        order: 2,
        isActive: true,
      },
      {
        id: 'local-banner-3',
        imageUrl: new URL('../media/banners/banner3.jpg', import.meta.url).href,
        mobileImageUrl: new URL('../media/banners/banner2-mobile.jpg', import.meta.url).href,
        title: 'New Arrivals',
        subtitle: 'Trending diamond jewellery',
        ctaText: 'Explore',
        ctaLink: '/new-arrivals',
        order: 3,
        isActive: true,
      },
      {
        id: 'local-banner-4',
        imageUrl: new URL('../media/banners/banner4.jpg', import.meta.url).href,
        mobileImageUrl: new URL('../media/banners/banner2-mobile.jpg', import.meta.url).href,
        title: 'New Arrivals',
        subtitle: 'Trending diamond jewellery',
        ctaText: 'Explore',
        ctaLink: '/new-arrivals',
        order: 4,
        isActive: true,
      },
    ];
    
    setBanners(localBanners);
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (banners.length === 0 || isPaused) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [banners.length, isPaused, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide]);

  if (loading) {
    return (
      <div className="relative w-full h-[250px] md:h-[350px] lg:h-[420px] bg-gray-200 animate-pulse overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      </div>
    );
  }

  if (banners.length === 0) return null;

  const getPrevIndex = () => (currentIndex - 1 + banners.length) % banners.length;
  const getNextIndex = () => (currentIndex + 1) % banners.length;

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        className="relative w-full h-[250px] md:h-[350px] lg:h-[420px] flex items-center justify-center py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Container for all banners */}
        <div className="relative w-full h-full flex items-center justify-center gap-4 lg:gap-6">
          {/* Left Banner (Previous) */}
          {banners.length > 1 && (
            <div className="w-[15%] h-[85%] opacity-40 hidden lg:block flex-shrink-0">
              <img
                src={banners[getPrevIndex()].imageUrl}
                alt=""
                className="w-full h-full object-cover rounded-lg transition-all duration-700"
              />
            </div>
          )}

          {/* Main Banner (Current) */}
          <div className="relative w-full lg:w-[70%] h-full flex-shrink-0">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <picture>
                  <source
                    media="(max-width: 768px)"
                    srcSet={banner.mobileImageUrl || banner.imageUrl}
                  />
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || `Banner ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </picture>

                {/* Overlay Content */}
                {(banner.title || banner.subtitle || banner.ctaText) && (
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full px-6 md:px-12 lg:px-16">
                      <div className="max-w-xl">
                        {banner.title && (
                          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 animate-fadeIn text-gray-800" style={{ fontFamily: 'serif' }}>
                            {banner.title}
                          </h1>
                        )}
                        {banner.subtitle && (
                          <p className="text-xl md:text-2xl lg:text-3xl mb-6 animate-fadeIn delay-100 italic text-gray-700" style={{ fontFamily: 'cursive' }}>
                            {banner.subtitle}
                          </p>
                        )}
                        {banner.ctaText && banner.ctaLink && (
                          <button
                            onClick={() => window.location.href = banner.ctaLink}
                            className="bg-white text-gray-800 px-8 py-3 text-base font-bold uppercase tracking-wider hover:bg-gray-100 transition-all transform hover:scale-105 animate-fadeIn delay-200 shadow-lg border-2 border-gray-300"
                          >
                            {banner.ctaText}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Banner (Next) */}
          {banners.length > 1 && (
            <div className="w-[15%] h-[85%] opacity-40 hidden lg:block flex-shrink-0">
              <img
                src={banners[getNextIndex()].imageUrl}
                alt=""
                className="w-full h-full object-cover rounded-lg transition-all duration-700"
              />
            </div>
          )}

          {/* Navigation Arrows */}
         
        </div>
      </div>

      {/* Dots Navigation - Below Banner */}
      {banners.length > 1 && (
  <div className="flex justify-center pb-6 pt-4">
    {banners.map((_, index) => (
      <button
        key={index}
        onClick={() => goToSlide(index)}
        aria-label={`Go to banner ${index + 1}`}
        className={`rounded-full transition-all bg-transparent duration-200 ease-out
          ${index === currentIndex ? 'scale-100' : 'opacity-60 hover:opacity-100'}`}
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          className={`${index === currentIndex ? 'text-red-600' : 'text-gray-400'}`}
        >
          <circle
            cx="4"
            cy="4"
            r="4"
            fill="currentColor"
          />
        </svg>
      </button>
    ))}
  </div>
)}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;