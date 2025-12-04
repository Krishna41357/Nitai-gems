import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';

const VideoModal = ({ reels, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const currentReel = reels[currentIndex];

  useEffect(() => {
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(err => console.error('Play error:', err));
    } else {
      video.pause();
    }
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          nextReel();
          break;
        case 'ArrowLeft':
          prevReel();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isPlaying, isMuted]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const nextReel = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const prevReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percent);
    }
  };

  const handleVideoEnd = () => {
    if (currentIndex < reels.length - 1) {
      nextReel();
    } else {
      setIsPlaying(false);
    }
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close video"
      >
        <X size={24} className="text-white" />
      </button>

      {/* Previous Button */}
      {currentIndex > 0 && (
        <button
          onClick={prevReel}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Previous video"
        >
          <ChevronLeft size={28} className="text-white" />
        </button>
      )}

      {/* Next Button */}
      {currentIndex < reels.length - 1 && (
        <button
          onClick={nextReel}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Next video"
        >
          <ChevronRight size={28} className="text-white" />
        </button>
      )}

      {/* Video Container */}
      <div className="relative w-full max-w-md mx-auto aspect-[9/16]">
        <video
          ref={videoRef}
          src={currentReel.videoUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          playsInline
          muted={isMuted}
        />

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 opacity-0 hover:opacity-100 transition-opacity">
          {/* Title at Top */}
          <div className="absolute top-0 left-0 right-0 p-4">
            <h3 className="text-white text-lg font-semibold">{currentReel.title}</h3>
          </div>

          {/* Center Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={32} className="text-white" fill="white" />
            ) : (
              <Play size={32} className="text-white ml-1" fill="white" />
            )}
          </button>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div
              onClick={handleProgressClick}
              className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-4"
            >
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={20} className="text-white" />
                ) : (
                  <Play size={20} className="text-white ml-0.5" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX size={20} className="text-white" />
                ) : (
                  <Volume2 size={20} className="text-white" />
                )}
              </button>
            </div>

            {/* Duration Badge */}
            {currentReel.duration && (
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                {Math.floor(currentReel.duration / 60)}:{String(currentReel.duration % 60).padStart(2, '0')}
              </div>
            )}
          </div>
        </div>

        {/* Reel Counter */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
          {currentIndex + 1} / {reels.length}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;