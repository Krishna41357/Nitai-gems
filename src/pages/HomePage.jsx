import React, { useState } from 'react';
import MainHeader from '../components/homepage/MainHeader';
import Navigation from '../components/homepage/Navigation';
import HeroCarousel from '../components/homepage/HeroCarousel';
import CollectionsSection from '../components/homepage/CollectionsSection';
import CategoryCardsSection from '../components/homepage/CategoryCardsSection';
import ReelsSection from '../components/homepage/ReelsSection';
import TrustBadgesSection from '../components/homepage/TrustBadgesSection';
import ExchangeProgramBanner from '../components/homepage/ExchangeProgramBanner';
import ReviewsCarousel from '../components/homepage/ReviewsCarousel';
import Footer from '../components/homepage/Footer';

const HomePage = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Header */}
      <MainHeader 
        logoUrl="/logo.png"
        onMenuClick={() => setShowMobileMenu(true)}
      />

      {/* Navigation with Mega Menu */}
      <Navigation 
        showMobileSidebar={showMobileMenu}
        onCloseSidebar={() => setShowMobileMenu(false)}
      />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Collections Section */}
      <CollectionsSection />

      {/* Category Cards Section */}
      <CategoryCardsSection limit={8} />

      {/* Reels Section */}
      <ReelsSection />

      {/* Trust Badges / Assurance Section */}
      <TrustBadgesSection />

      
      {/* Exchange Program Banner */}
      <ExchangeProgramBanner />

      {/* Customer Reviews Carousel */}
      <ReviewsCarousel />

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5C1F1F] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">Certified Quality</h3>
              <p className="text-gray-600">
                All our jewellery is hallmarked and comes with certification
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5C1F1F] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">Free Shipping</h3>
              <p className="text-gray-600">
                Enjoy free shipping on orders above ₹50,000
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5C1F1F] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">↩</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">Easy Returns</h3>
              <p className="text-gray-600">
                30-day return policy for your peace of mind
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}

      {/* Footer - Using new Footer component */}
      <Footer />
    </div>
  );
};

export default HomePage;