import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { categorySlug, subCategorySlug } = useParams();
  const [isHovered, setIsHovered] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const hasDiscount = product.pricing?.discountedPrice && 
    product.pricing.discountedPrice < product.pricing.basePrice;
  
  const discountPercent = hasDiscount
    ? Math.round(((product.pricing.basePrice - product.pricing.discountedPrice) / product.pricing.basePrice) * 100)
    : 0;

  const formatPrice = (price) => {
    if (!price) return '₹0';
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isTogglingWishlist) return;

    try {
      setIsTogglingWishlist(true);
      setIsInWishlist(!isInWishlist);
      // Your wishlist API call here
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  // Generate product URL based on current route context
  const getProductUrl = () => {
    // If we have category context from the listing page, include it
    if (categorySlug && subCategorySlug) {
      return `/products/category/${categorySlug}/${subCategorySlug}/${product.slug}`;
    } else if (categorySlug) {
      return `/products/category/${categorySlug}/${product.slug}`;
    } else {
      // Fallback to simple product URL
      return `/product/${product.slug}`;
    }
  };

  return (
    <Link 
      to={getProductUrl()}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* First Image */}
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out ${
            isHovered ? '-translate-x-full' : 'translate-x-0'
          }`}
          loading="lazy"
        />
        
        {/* Second Image (shown on hover) */}
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out ${
              isHovered ? 'translate-x-0' : 'translate-x-full'
            }`}
            loading="lazy"
          />
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold z-10">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={isTogglingWishlist}
          className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm z-10 disabled:opacity-50"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4.5 h-4.5 transition-all ${
              isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Out of Stock Overlay */}
        {!product.inventory?.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="bg-white px-4 py-1 rounded-full text-sm font-semibold text-gray-900">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-normal text-[15px] leading-snug mb-3 line-clamp-2 text-gray-800 min-h-[42px]">
          {product.name}
        </h3>

        {/* Price Section */}
        <div>
          {hasDiscount ? (
            <div>
              <p className="text-sm text-gray-400 line-through mb-1">
                {formatPrice(product.pricing.basePrice)}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-lg font-semibold text-gray-900">
                  {formatPrice(product.pricing.discountedPrice)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {formatPrice(product.pricing?.basePrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;