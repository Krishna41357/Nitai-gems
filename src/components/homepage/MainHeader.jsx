import React, { useState, useEffect, useRef } from 'react';
import { Heart, User, ShoppingCart, Search } from 'lucide-react';
import { useCart, useWishlist, useAuth } from '../../contexts/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';

const MainHeader = ({ logoUrl = '../media/logo/logo.jpg', onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const dropdownRef = useRef(null);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const isOnProductsPage = location.pathname.startsWith('/products');
      
      if (isOnProductsPage) {
        // Update search param on products page
        navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      } else {
        // Navigate from homepage to products page
        navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      }
      setShowMobileSearch(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };


  const handleUserAction = (action) => {
    setShowUserDropdown(false);
    
    switch (action) {
      case 'account':
        handleNavigation('/account');
        break;
      case 'orders':
        handleNavigation('/orders');
        break;
      case 'logout':
        logout();
        handleNavigation('/');
        break;
      case 'login':
        handleNavigation('/login');
        break;
      case 'signup':
        handleNavigation('/signup');
        break;
      default:
        break;
    }
  };

  const iconColor = "#8B6914"; // Golden brown color

  return (
    <>
      <header
        className={` border-b bg-white border-transparent sticky top-0 z-50 transition-shadow duration-200 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto border-none px-4">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Left Section - Logo */}
            <div className="flex items-center  gap-3">
              <button
                onClick={() => handleNavigation('/')}
                className="flex-shrink-0 border-none bg-transparent"
                aria-label="Go to home"
              >
                <img
                  src="./logo/logo.png"
                  alt="Logo"
                  className="h-10 md:h-20 w-auto bg-transparent object-contain"
                />
              </button>
            </div>

            {/* Center Section - Search Bar */}
            <div className="flex flex-1 justify-center mx-8">
              <div className="w-full max-w-md">
                <div className="relative flex items-center">
                  <div className="absolute left-4">
                    <Search size={20} color="#000000" strokeWidth={1.5} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                    placeholder="Search for jewellery..."
                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-black rounded-full focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm text-black placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Section - Icons */}
            <div className="flex items-center gap-1 md:gap-4">
              {/* Wishlist */}
              <button
                onClick={() => handleNavigation('/wishlist')}
                className="p-2 bg-transparent relative group"
                aria-label="Wishlist"
              >
                <Heart size={22} color={iconColor} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-medium">
                    {wishlistCount}
                  </span>
                )}
                <span className="hidden md:block absolute -bottom-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Wishlist
                </span>
              </button>

              {/* User Profile */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="p-2 bg-transparent relative group"
                  aria-label="User account"
                >
                  <User size={22} color={iconColor} strokeWidth={1.5} />
                  <span className="hidden md:block absolute -bottom-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Account
                  </span>
                </button>

                {/* User Dropdown */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 animate-fadeIn">
                    {isAuthenticated ? (
                      <>
                        {user && (
                          <div className="px-4 py-2 border-b border-gray-200">
                            <p className="text-sm font-medium text-gray-900">
                              {user.name || user.email}
                            </p>
                          </div>
                        )}
                        <button
                          onClick={() => handleUserAction('account')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
                        >
                          My Account
                        </button>
                        <button
                          onClick={() => handleUserAction('orders')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
                        >
                          My Orders
                        </button>
                        <button
                          onClick={() => handleUserAction('logout')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600 transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleUserAction('login')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => handleUserAction('signup')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
                        >
                          Sign Up
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={() => handleNavigation('/cart')}
                className="p-2 bg-transparent relative group"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={22} color={iconColor} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-medium">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
                <span className="hidden md:block absolute -bottom-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Cart
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden bg-transparent border-b border-transparent px-4 py-3 sticky top-16 z-40">
          <div className="relative flex items-center">
            <div className="absolute left-4">
              <Search size={18} color="#000000" strokeWidth={1.5} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Search for jewellery..."
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-black rounded-full focus:outline-none focus:ring-1 focus:ring-black text-sm text-black placeholder-gray-500"
              autoFocus
            />
          </div>
        </div>
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
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default MainHeader;