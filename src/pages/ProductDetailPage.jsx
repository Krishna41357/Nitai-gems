import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, Share2, ChevronDown, ShoppingCart, Zap, ChevronRight } from "lucide-react";
import MainHeader from "../components/homepage/MainHeader";
import Navigation from "../components/homepage/Navigation";
import Footer from "../components/homepage/Footer";

const ProductDetailPage = () => {
  const { slug, categorySlug, subCategorySlug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${import.meta.env.VITE_APP_BASE_URL}/products/slug/${slug}`;
      console.log('Fetching product from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      console.log('Product fetched:', data);
      
      setProduct(data);
      if (data.necklaceLayers?.length > 0) {
        setSelectedLayer(data.necklaceLayers[0]);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: 'Home ', path: '/' } ,{label: ' Products', path: '/products'}];
    
    if (categorySlug) {
      breadcrumbs.push({ 
        label: categorySlug.replace(/-/g, ' '), 
        path: `/products/category/${categorySlug}` 
      });
    }
    
    if (subCategorySlug) {
      breadcrumbs.push({ 
        label: subCategorySlug.replace(/-/g, ' '), 
        path: `/products/category/${categorySlug}/${subCategorySlug}` 
      });
    }
    
    if (product) {
      breadcrumbs.push({ 
        label: product.name, 
        path: null 
      });
    }
    
    return breadcrumbs;
  };

  const getCurrentPrice = () => {
    if (selectedLayer) {
      return selectedLayer.discountedPrice || selectedLayer.basePrice;
    }
    return product?.pricing?.discountedPrice || product?.pricing?.basePrice || 0;
  };

  const getOriginalPrice = () => {
    if (selectedLayer) {
      return selectedLayer.basePrice;
    }
    return product?.pricing?.basePrice || 0;
  };

  const hasDiscount = () => {
    const current = getCurrentPrice();
    const original = getOriginalPrice();
    return current < original;
  };

  const getDiscountPercent = () => {
    if (!hasDiscount()) return 0;
    const current = getCurrentPrice();
    const original = getOriginalPrice();
    return Math.round(((original - current) / original) * 100);
  };

  const formatPrice = (price) => {
    if (!price) return '₹0';
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0],
      price: getCurrentPrice(),
      layer: selectedLayer,
      quantity: 1
    };
    console.log('Add to cart:', cartItem);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    console.log('Buy now');
  };

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const DetailSection = ({ title, children, icon }) => {
    const isExpanded = expandedSection === title;
    
    return (
      <div className="border-t-2 border-l-1 border-r-1 rounded-t-xl  border-grey-400">
        <button
          onClick={() => toggleSection(title)}
          className="w-full flex  bg-white items-center hover:border-none border-none border-transparent  justify-between py-4 text-left"
        >
          <div className="flex items-center gap-3">
            {icon}
            <span className="font-semibold  text-gray-900">{title}</span>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
        {isExpanded && (
          <div className="pb-4 mx-10 text-gray-700 font-900 font-serif">
            {children}
          </div>
        )}
      </div>
    );
  };

if (loading) {
  return (
    <>
      <MainHeader />
      <Navigation />
      <div className="min-h-screen w-screen bg-black/95 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
        {/* Subtle golden glow */}
        <div className="absolute inset-0 bg-gradient-radial from-yellow-500/5 via-transparent to-transparent"></div>
        
        <div className="text-center relative z-10">
          {/* Logo with elegant golden ring */}
          <div className="relative inline-block mb-8">
            {/* Single golden rotating ring */}
            <div className="absolute inset-0 -m-6">
              <div className="w-36 h-36 border border-transparent border-t-yellow-500/70 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
            </div>
            
            {/* Logo */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-full p-4 shadow-2xl shadow-yellow-500/20 backdrop-blur-sm border border-yellow-500/20">
              <img 
                src="./logo/logo.png" 
                alt="Nitai Gems" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          {/* Minimal text */}
          <div className="space-y-4">
            <p className="text-yellow-500 text-2xl font-serif font-light tracking-widest">
              Nitai Gems
            </p>
            
            {/* Golden dots */}
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
              <span className="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></span>
              <span className="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

  if (error || !product) {
    return (
      <>
        <MainHeader />
        <Navigation />
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center max-w-2xl">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Product Not Found</h2>
            <p className="text-gray-600 mb-2">We couldn't find a product with slug: <strong>"{slug}"</strong></p>
            <p className="text-red-600 text-sm mb-6">{error}</p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate('/products')}
                className="bg-[#832729] text-white px-6 py-3 rounded-lg hover:bg-[#6A1F21] transition-colors"
              >
                Browse All Products
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="w-screen px-4 md:px-8 lg:px-12 py-6 md:py-8">
          {/* Breadcrumb Navigation */}
          <div className="max-w-7xl mx-auto mb-6">
            <nav className="flex items-center gap-2 text-sm">
              {getBreadcrumbs().map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                  {crumb.path ? (
                    <button
                      onClick={() => navigate(crumb.path)}
                      className="text-gray-600 hover:text-[#832729] bg-transparent capitalize transition-colors"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-[#832729] font-medium capitalize line-clamp-1">{crumb.label}</span>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
                  <img
                    src={product.images?.[selectedImage] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {!product.inventory?.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white px-6 py-2 rounded-full font-semibold text-gray-900">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Images */}
                {product.images?.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index 
                            ? 'border-[#832729] ring-2 ring-[#832729]/20' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Title and SKU */}
                <div>
                  <h1 className="text-3xl font-serif text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                </div>

                {/* Price */}
                <div className="border-t border-b border-gray-200 py-4">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(getCurrentPrice())}
                    </span>
                    {hasDiscount() && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          {formatPrice(getOriginalPrice())}
                        </span>
                        <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded font-semibold">
                          {getDiscountPercent()}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Incl. taxes and charges</p>
                </div>

                {/* Necklace Layers */}
                {product.necklaceLayers?.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Select Weight: {selectedLayer?.weight}g
                    </label>
                    <select
                      value={selectedLayer?.weight}
                      onChange={(e) => {
                        const layer = product.necklaceLayers.find(
                          l => l.weight === parseFloat(e.target.value)
                        );
                        setSelectedLayer(layer);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#832729]"
                    >
                      {product.necklaceLayers.map((layer, index) => (
                        <option key={index} value={layer.weight}>
                          {layer.weight}g - {formatPrice(layer.discountedPrice || layer.basePrice)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Availability */}
                {product.inventory && (
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      product.inventory.inStock ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      product.inventory.inStock ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {product.inventory.inStock 
                        ? `In Stock (${product.inventory.stock} available)`
                        : 'Out of Stock'
                      }
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={handleBuyNow}
                      disabled={!product.inventory?.inStock}
                      className="flex-1 bg-[#832729] text-white py-4 rounded-lg font-semibold hover:bg-[#6A1F21] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Zap className="w-5 h-5" />
                      Buy Now
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inventory?.inStock}
                      className="flex-1 bg-white border-2 border-[#832729] text-[#832729] py-4 rounded-lg font-semibold hover:bg-[#832729] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={toggleWishlist}
                      className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                        isInWishlist
                          ? 'bg-red-50 border-red-500 text-red-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500' : ''}`} />
                      {isInWishlist ? 'Wishlisted' : 'Add to Wishlist'}
                    </button>
                    <button className="py-3 px-6 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Product Details Sections */}
                <div className="border-gray-300 font-serif border-2 border-t-0 rounded-r-xl rounded-l-xl border-b-2 space-y-2">
                  {/* Metal Details */}
                  {(product.details?.metal || product.details?.metalPurity || product.details?.metalWeight) && (
                    <DetailSection 
                      title="METAL DETAILS"
                      icon={<div className="w-5 h-5 text-amber-600">⚜</div>}
                    >
                      <div className="grid grid-cols-2 bg-white gap-4">
                      
                        {product.details.metal && (
                          <div>
                            <p className="text-md text-gray-500">Metal</p>
                            <p className="font-medium">{product.details.metal}</p>
                          </div>
                        )}
                        {product.details.metalPurity && (
                          <div>
                            <p className="text-sm text-gray-500">Purity</p>
                            <p className="font-medium">{product.details.metalPurity}</p>
                          </div>
                        )}
                        {product.details.metalWeight > 0 && (
                          <div>
                            <p className="text-sm text-gray-500">Metal Weight</p>
                            <p className="font-medium">{product.details.metalWeight}g</p>
                          </div>
                        )}
                        {product.details.weight > 0 && (
                          <div>
                            <p className="text-sm text-gray-500">Gross Weight</p>
                            <p className="font-medium">{product.details.weight}g</p>
                          </div>
                        )}
                      </div>
                    </DetailSection>
                  )}

                  {/* Stone Details */}
                  {(product.details?.stone || product.details?.stoneType || product.details?.stoneWeight) && (
                    <DetailSection 
                      title="DIAMOND/STONE DETAILS"
                      icon={<div className="w-5 h-5 text-blue-600">💎</div>}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {product.details.stone && (
                          <div>
                            <p className="text-sm text-gray-500">Stone</p>
                            <p className="font-medium">{product.details.stone}</p>
                          </div>
                        )}
                        {product.details.stoneType && (
                          <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="font-medium">{product.details.stoneType}</p>
                          </div>
                        )}
                        {product.details.clarity && (
                          <div>
                            <p className="text-sm text-gray-500">Clarity</p>
                            <p className="font-medium">{product.details.clarity}</p>
                          </div>
                        )}
                        {product.details.color && (
                          <div>
                            <p className="text-sm text-gray-500">Color</p>
                            <p className="font-medium">{product.details.color}</p>
                          </div>
                        )}
                        {product.details.stoneWeight > 0 && (
                          <div>
                            <p className="text-sm text-gray-500">Stone Weight</p>
                            <p className="font-medium">{product.details.stoneWeight} ct</p>
                          </div>
                        )}
                      </div>
                    </DetailSection>
                  )}

                  {/* General Details */}
                  {(product.details?.size || product.details?.certification) && (
                    <DetailSection 
                      title="GENERAL DETAILS"
                      icon={<div className="w-5 h-5 text-gray-600">ℹ</div>}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {product.details.size && (
                          <div>
                            <p className="text-sm text-gray-500">Size</p>
                            <p className="font-medium">{product.details.size}</p>
                          </div>
                        )}
                        {product.details.certification && (
                          <div>
                            <p className="text-sm text-gray-500">Certification</p>
                            <p className="font-medium">{product.details.certification}</p>
                          </div>
                        )}
                      </div>
                    </DetailSection>
                  )}

                  {/* Tags */}
                  {product.tags?.length > 0 && (
                    <DetailSection 
                      title="FEATURES"
                      icon={<div className="w-5 h-5 text-purple-600">🏷</div>}
                    >
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </DetailSection>
                  )}

                  {/* Pricing Info */}
                  {product.pricing?.couponApplicable && (
                    <DetailSection 
                      title="OFFERS"
                      icon={<div className="w-5 h-5 text-green-600">🎁</div>}
                    >
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-800 font-medium mb-2">
                          Coupon Applicable
                        </p>
                        {product.pricing.couponList?.length > 0 && (
                          <div className="space-y-2">
                            {product.pricing.couponList.map((coupon, index) => (
                              <div
                                key={index}
                                className="bg-white px-3 py-2 rounded border border-green-300"
                              >
                                <p className="text-sm font-mono text-gray-900">{coupon}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </DetailSection>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ProductDetailPage;