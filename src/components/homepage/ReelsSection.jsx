import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './reels.css';
import './category-bg.css';

const ReelsSection = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/reels`);
      if (response.ok) {
        const data = await response.json();
        const activeReels = data.filter(reel => reel.isActive);
        
        if (activeReels.length > 0) {
          setReels(activeReels);
        } else {
          loadLocalReels();
        }
      } else {
        loadLocalReels();
      }
    } catch (error) {
      console.error('Error fetching reels:', error);
      loadLocalReels();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalReels = () => {
    const localReels = [
      {
        id: 'local-1',
        videoUrl: new URL('../media/videos/video1.mp4', import.meta.url).href,
        title: 'Diamond Styling Tips',
        description: 'Exquisite Vines Diamond Necklace Set',
        duration: 45,
        isActive: true,
      },
      {
        id: 'local-2',
        videoUrl: new URL('../media/videos/video2.mp4', import.meta.url).href,
        title: 'Elegant Diamond Jewellery',
        description: 'Every Day Diamond Collection',
        duration: 60,
        isActive: true,
      },
{
        id: 'local-3',
        videoUrl: new URL('../media/videos/video3.mp4', import.meta.url).href,
        title: 'Precious Necklace Jewellery',
        description: 'Precious Stones Collection',
        duration: 60,
        isActive: true,
      },

    ];
    
    setReels(localReels);
  };

  const openModal = (index) => {
    setCurrentReelIndex(index);
    setShowModal(true);
    setProgress(0);
    setIsPlaying(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsPlaying(false);
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const goToNextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(prev => prev + 1);
      setProgress(0);
      setIsPlaying(false);
    } else {
      closeModal();
    }
  };

  const goToPreviousReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(prev => prev - 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    const duration = videoRef.current?.duration || reels[currentReelIndex]?.duration || 10;
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current);
          goToNextReel();
          return 0;
        }
        return prev + (100 / (duration * 10));
      });
    }, 100);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const handleVideoEnded = () => {
    goToNextReel();
  };

  useEffect(() => {
    if (showModal && videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(err => console.log('Auto-play prevented:', err));
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [showModal, currentReelIndex]);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-12 w-96 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-[600px] bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="relative h-[600px] max-w-md mx-auto">
            <div className="absolute inset-0 bg-gray-200 rounded-3xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (reels.length === 0) return null;

  const getStackPosition = (index) => {
    const positions = [
      { rotate: 0, scale: 1, zIndex: 50, x: 0 },
      { rotate: -3, scale: 0.95, zIndex: 40, x: -30 },
      { rotate: 3, scale: 0.9, zIndex: 30, x: 30 },
      { rotate: -2, scale: 0.85, zIndex: 20, x: -40 },
      { rotate: 2, scale: 0.8, zIndex: 10, x: 40 },
    ];
    return positions[index] || { rotate: 0, scale: 0.75, zIndex: 0, x: 0 };
  };

  return (
    <>
      <section className="py-16 category-bg-section overflow-hidden relative">
        {/* Background layers (gradient, blurred shapes, particles) */}
        <div className="reels-bg" aria-hidden="true">
          <div className="reels-gradient" />
          <div className="floating-shape shape-1" />
          <div className="floating-shape shape-2" />
          <div className="floating-shape shape-3" />
          <div className="floating-shape shape-4" />
          {/* falling sparkles (Reels only) */}
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
          <div className="particle particle-4" />
          <div className="particle particle-5" />
          <div className="particle particle-6" />
          <div className="particle particle-7" />
          <div className="particle particle-8" />
          <div className="particle particle-9" />
          <div className="particle particle-10" />
          <div className="particle particle-11" />
          <div className="particle particle-12" />
          <div className="particle particle-13" />
          <div className="particle particle-14" />
          <div className="particle particle-15" />
          <div className="particle particle-16" />
          <div className="particle particle-17" />
          <div className="particle particle-18" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-3">
              Styling 101 With Diamonds
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Trendsetting diamond jewellery suited for every occasion
            </p>
          </div>

          {/* Stacked Reels */}
          <div className="relative h-[550px] max-w-md mx-auto perspective-1000">
            {reels.slice(0, 5).map((reel, index) => {
              const position = getStackPosition(index);
              return (
                <div
                  key={reel.id}
                  onClick={() => openModal(index)}
                  className="absolute inset-0 cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    transform: `translateX(${position.x}px) scale(${position.scale}) rotate(${position.rotate}deg)`,
                    zIndex: position.zIndex,
                    transformOrigin: 'center center',
                  }}
                >
                  <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow">
                    {/* Video Thumbnail (first frame) */}
                    <video
                      src={reel.videoUrl}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      muted
                      playsInline
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                    {/* Top Controls (only on front card) */}
                    {index === 0 && (
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span className="text-white text-sm font-medium">Live</span>
                        </div>
                        <button className="text-white hover:scale-110 transition-transform">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                        </button>
                      </div>
                    )}

                    {/* Center Play Button - Removed for auto-play */}
                    
                    {/* Bottom Info (only on front card) */}
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-white font-semibold text-xl mb-1">
                          {reel.title}
                        </h3>
                        <p className="text-white/90 text-sm">
                          {reel.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Progress Indicators */}
            <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 flex gap-2">
              {reels.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all ${
                    index < reels.length ? 'w-12' : 'w-8'
                  } ${index === 0 ? 'bg-gray-900' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
          {/* Progress Bars */}
          <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-2">
            {reels.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: index < currentReelIndex ? '100%' : index === currentReelIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Close Button */}
        <button
  onClick={closeModal}
  className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70  transition-colors"
> X

</button>

{/* Prev arrow */}
{currentReelIndex > 0 && (
  <button
    onClick={goToPreviousReel}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-20 h-20 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
  >
    
    <ChevronLeft size={48} className="text-white stroke-white " />
  </button>
)}
          
          {currentReelIndex < reels.length - 1 && (
            <button
              onClick={goToNextReel}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-20 h-20 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={48} />
            </button>
          )}

          {/* Video Container */}
          <div className="relative w-full max-w-md h-full max-h-[90vh] flex items-center justify-center">
            <video
              ref={videoRef}
              src={reels[currentReelIndex]?.videoUrl}
              className="w-full h-full object-contain"
              loop={false}
              muted={isMuted}
              playsInline
              autoPlay
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoEnded}
            />

            {/* Video Controls Overlay - Removed play button, just for pause */}
            <div className="absolute inset-0" onClick={togglePlay} />

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="absolute bottom-24 right-4 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            {/* Video Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-semibold text-xl mb-1">
                {reels[currentReelIndex]?.title}
              </h3>
              {reels[currentReelIndex]?.description && (
                <p className="text-white/90 text-sm mb-3">
                  {reels[currentReelIndex]?.description}
                </p>
              )}
              <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
                Shop Now
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default ReelsSection;