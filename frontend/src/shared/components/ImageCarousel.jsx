import { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageCarousel({
  images,
  alt = 'Carousel image',
  autoPlay = false,
  autoPlayInterval = 5000,
  className = '',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [visibleSlides, setVisibleSlides] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(0);
  const autoPlayRef = useRef(null);

  const minSwipeDistance = 50;

  const slidesCount = images.length;
  const maxIndex = Math.max(0, slidesCount - Math.max(1, visibleSlides));

  // Track responsive breakpoint for visible slides
  useEffect(() => {
    const updateVisibleSlides = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      if (width >= 1280) {
        setVisibleSlides(4);
      } else if (width >= 1024) {
        setVisibleSlides(3);
      } else if (width >= 640) {
        setVisibleSlides(2);
      } else {
        setVisibleSlides(1);
      }
    };

    updateVisibleSlides();
    window.addEventListener('resize', updateVisibleSlides);
    return () => window.removeEventListener('resize', updateVisibleSlides);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  }, [maxIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && slidesCount > 1) {
      autoPlayRef.current = setInterval(goToNext, autoPlayInterval);
      return () => clearInterval(autoPlayRef.current);
    }
  }, [autoPlay, autoPlayInterval, goToNext, slidesCount]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      {/* Main carousel container */}
      <div className="relative flex items-center">
        {/* Previous button */}
        {slidesCount > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:bg-white hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:left-4"
            aria-label="Previous image"
            type="button"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
        )}

        {/* Images container */}
        <div className="w-full overflow-hidden px-4 sm:px-6 lg:px-8">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)`,
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 px-1 sm:px-2 sm:w-1/2 lg:w-1/3 xl:w-1/4"
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${slidesCount}`}
                aria-hidden={index < currentIndex || index >= currentIndex + visibleSlides}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                  <img
                    src={image}
                    alt={`${alt} ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading={index <= 1 ? 'eager' : 'lazy'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next button */}
        {slidesCount > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:bg-white hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:right-4"
            aria-label="Next image"
            type="button"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      {slidesCount > 1 && (
        <div
          className="mt-4 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Carousel navigation"
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                index === currentIndex
                  ? 'w-6 bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}

      {/* Screen reader live region for slide announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing slide {currentIndex + 1} of {slidesCount}
      </div>

      {/* Debug: Viewport info */}
      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-500">
        <span>Viewport: {viewportWidth}px</span>
        <span>|</span>
        <span>Images shown: {visibleSlides}</span>
      </div>
    </div>
  );
}

