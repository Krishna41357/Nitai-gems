import React, { useState, useEffect, useRef } from 'react';
import './category-bg.css';
import { useNavigate } from 'react-router-dom';

const CategoryCardsSection = ({ limit = 7 }) => {
  const [categories, setCategories] = useState([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let ticking = false;
    let rafId = null;
    let target = 0;
    let current = 0;

    const smoothStep = () => {
      current += (target - current) * 0.12; // lerp factor
      el.style.setProperty('--progress', String(current));
      if (Math.abs(target - current) > 0.0005) {
        rafId = window.requestAnimationFrame(smoothStep);
      } else {
        rafId = null;
      }
    };

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewHeight = window.innerHeight || document.documentElement.clientHeight;
      // progress: 0..1 where 0 = not visible, 1 = fully in viewport
      target = Math.max(0, Math.min(1, (viewHeight - rect.top) / (viewHeight + rect.height)));
      if (!rafId) rafId = window.requestAnimationFrame(smoothStep);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setTotalCategories(data.length);
      const limitedCategories = data.slice(0, limit);
      setCategories(limitedCategories);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/products/category/${categorySlug}`);
  };

  const handleViewAllClick = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-12 w-96 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-8 animate-pulse">
                <div className="w-full aspect-square bg-gray-200 rounded-xl mb-6" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 mb-4">Failed to load categories</p>
          <button
            onClick={fetchCategories}
            className="text-[#8B4513] hover:underline font-semibold"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-16 category-bg-section">
      <div className="category-bg" aria-hidden="true">
        <div className="category-gradient" />
        <div className="ornament orn-1" />
        <div className="ornament orn-2" />
        <div className="ornament orn-3" />
        <div className="ornament orn-4" />
        {/* decorative ornaments only - no sparkles */}
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-3">
            Find Your Perfect Match
          </h2>
          <p className="text-xl text-gray-600 font-light">
            Shop by Categories
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className="group bg-white border border-gray-200 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-sm bg-white/80"
              style={{
                minHeight: '380px'
              }}
            >
              {/* Category Image Container */}
              <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {/* Empty placeholder for image */}
                  </div>
                )}
              </div>

              {/* Category Name */}
              <h3 className="text-xl font-serif text-gray-900 text-center group-hover:text-[#8B4513] transition-colors uppercase tracking-wide">
                {category.name}
              </h3>
            </div>
          ))}

          {/* View All Card - Always 8th position */}
          <div
            onClick={handleViewAllClick}
            className="group bg-white border border-gray-200 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-sm bg-white/80 flex flex-col items-center justify-center"
            style={{
              minHeight: '380px'
            }}
          >
            <div className="text-center">
              <div className="text-6xl font-serif text-[#8B4513] mb-4">
                {totalCategories}+
              </div>
              <p className="text-lg text-gray-700 mb-8">
                Categories to choose from
              </p>
              <button className="px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 uppercase tracking-wider text-sm">
                VIEW ALL
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCardsSection;