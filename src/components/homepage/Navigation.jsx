import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const megaMenuRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); 

  const API_BASE = import.meta.env.VITE_APP_BASE_URL;
  const MAX_MAIN_CATEGORIES = 7;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categorySlug) => {
    if (subcategories[categorySlug]) return;

    try {
      const response = await fetch(`${API_BASE}/subcategories/category/${categorySlug}`);
      if (!response.ok) throw new Error('Failed to fetch subcategories');
      const data = await response.json();
      setSubcategories(prev => ({
        ...prev,
        [categorySlug]: data || []
      }));
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const handleCategoryHover = (category) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    setHoveredCategory(category);
    if (category) {
      fetchSubcategories(category.slug);
    }
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 200);
  };

  // Replace the handleNavigation function
 const handleNavigation = (path) => {
  if (path.startsWith('/category/')) {
    // Always navigate to products page with category filter
    navigate(`/products${path}`); // This creates /products/category/...
  } else {
    navigate(path);
  }
};

  const toggleMobileCategory = (categorySlug) => {
    if (expandedMobileCategory === categorySlug) {
      setExpandedMobileCategory(null);
    } else {
      setExpandedMobileCategory(categorySlug);
      fetchSubcategories(categorySlug);
    }
  };

  const mainCategories = categories.slice(0, MAX_MAIN_CATEGORIES);
  const moreCategories = categories.slice(MAX_MAIN_CATEGORIES);

  if (loading) {
    return (
      <nav className="bg-transparent border-b border-transparent  top-20 md:top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6 h-14">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className="bg-transparent border-b border-transparent  top-20 md:top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <p className="text-red-600 mb-2">Failed to load categories</p>
            <button
              onClick={fetchCategories}
              className="text-sm text-[#8B4513] hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white sticky border-b border-transparent z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center bg-transparent justify-center gap-8 h-14">
            {mainCategories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => handleCategoryHover(category)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleNavigation(`/category/${category.slug}`)}
                  className="text-[#8B4513] font-large text-sm transition-colors bg-transparent hover:border-transparent relative py-4 group"
                >
                  {category.name}
                  <span className="absolute bottom-3 left-1/2 w-0 h-0.5 bg-[#8B4513] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </button>
              </div>
            ))}

            {moreCategories.length > 0 && (
              <div className="relative group">
                <button className="text-[#8B4513] font-medium text-sm transition-colors relative py-4">
                  More
                  <span className="absolute bottom-3 left-1/2 w-0 h-0.5 bg-[#8B4513] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </button>
                <div className="absolute top-full right-0 mt-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {moreCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleNavigation(`/category/${category.slug}`)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-[#8B4513]"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mega Menu */}
        {hoveredCategory && (
          <div
            ref={megaMenuRef}
            onMouseEnter={() => handleCategoryHover(hoveredCategory)}
            onMouseLeave={handleMouseLeave}
            className="absolute left-0 right-0 bg-white border-t-2 border-[#8B4513] shadow-lg animate-fadeIn"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="flex gap-8">
                {/* Left Sidebar - Filter Options */}
                <div className="w-64  flex-shrink-0">
                  <div className="space-y-4">
                    <button className="w-full text-left px-4 py-3 bg-[#F5E6D3] text-gray-900 font-medium rounded-lg">
                      Category
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-transparent text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      Price
                    </button>
                    
                    <button className="w-full text-left px-4 py-3 bg-transparent text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      Gender
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-transparent text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      Metal & Stones
                    </button>
                  </div>
                </div>

                {/* Main Content Area - Subcategories */}
                <div className="flex-1">
                  <div className="grid  grid-cols-3 gap-6 mb-8">
                    {subcategories[hoveredCategory.slug]?.slice(0, 6).map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => handleNavigation(`/category/${hoveredCategory.slug}/${subcategory.slug}`)}
                        className="flex items-center gap-4 p-4 bg-transparent border-none hover:bg-gray-50 rounded-lg transition-colors group text-left"
                      >
                        {subcategory.image ? (
                          <img
                            src={subcategory.image}
                            alt={subcategory.name}
                            className="w-16 h-16 object-cover rounded-full bg-transparent flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-full bg-transparent flex-shrink-0 flex items-center justify-center">
                            <span className="text-2xl">💎</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 group-hover:text-[#8B4513] transition-colors">
                            {subcategory.name}
                          </h3>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Banner Section */}
                  <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                        ))}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {hoveredCategory.name} for You — Crafted with Precision, Designed for Elegance.
                        </h3>
                        <p className="text-gray-600">Explore 3500+ Stunning Styles.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNavigation(`/category/${hoveredCategory.slug}`)}
                      className="bg-[#8B4513] text-white px-8 py-3 rounded-full font-medium hover:bg-[#704010] transition-colors"
                    >
                      View All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Sidebar */}
      {showMobileSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto md:hidden animate-slideIn">
            <div className=" top-0 bg-white border-b px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Categories</h2>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="py-2">
              {categories.map((category) => (
                <div key={category.id} className="border-b">
                  <button
                    onClick={() => toggleMobileCategory(category.slug)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                  >
                    <span className="font-medium">{category.name}</span>
                    <ChevronRight
                      size={20}
                      className={`transition-transform ${
                        expandedMobileCategory === category.slug ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {expandedMobileCategory === category.slug && (
                    <div className="bg-gray-50 py-2">
                      <button
                        onClick={() => {
                          handleNavigation(`/category/${category.slug}`);
                          setShowMobileSidebar(false);
                        }}
                        className="w-full text-left px-8 py-2 text-[#8B4513] font-medium hover:bg-gray-100"
                      >
                        View All {category.name}
                      </button>
                      {subcategories[category.slug]?.map((subcategory) => (
                        <button
                          key={subcategory.id}
                          onClick={() => {
                            handleNavigation(`/category/${category.slug}/${subcategory.slug}`);
                            setShowMobileSidebar(false);
                          }}
                          className="w-full text-left px-8 py-2 hover:bg-gray-100 text-sm"
                        >
                          {subcategory.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navigation;