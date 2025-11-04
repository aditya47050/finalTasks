"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, Grid3X3, Heart, Share2, Download, Info, X } from "lucide-react";

const ImageSlideshow = ({
  images,
  title,
  description,
  autoPlay = true,
  interval = 4000,
  showThumbnails = true,
  showInfo = true,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const [isHovering, setIsHovering] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showDescription, setShowDescription] = React.useState(false);
  const [likedImages, setLikedImages] = React.useState(new Set());
  const [loadedImages, setLoadedImages] = React.useState(new Set());
  const [imageLoadErrors, setImageLoadErrors] = React.useState(new Set());

  // Fallback images
  const fallbackImages = [
    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop",
  ];

  // Ensure valid images array
  const validImages = React.useMemo(() => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return fallbackImages;
    }
    return images.filter((img) => img && typeof img === "string");
  }, [images]);

  // Autoplay effect - FIXED: Added currentIndex dependency
  React.useEffect(() => {
    if (!isPlaying || validImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, validImages.length, interval, currentIndex]); // Added currentIndex

  // Fullscreen effect - FIXED: Better fullscreen handling
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // FIXED: Proper keyboard navigation dependency array
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle keys if in fullscreen or no input is focused
      if (isFullscreen || !document.activeElement || document.activeElement.tagName === 'BODY') {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            goToPrevious();
            break;
          case "ArrowRight":
            e.preventDefault();
            goToNext();
            break;
          case " ":
            e.preventDefault();
            if (validImages.length > 1) {
              togglePlayPause();
            }
            break;
          case "Escape":
            if (isFullscreen) {
              e.preventDefault();
              toggleFullscreen();
            } else if (showDescription) {
              setShowDescription(false);
            }
            break;
          case "i":
            if (description) {
              e.preventDefault();
              setShowDescription((prev) => !prev);
            }
            break;
          case "l":
            e.preventDefault();
            toggleLike(currentIndex);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isFullscreen, description, showDescription, validImages.length]); // Fixed dependencies

  const goToNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const goToPrevious = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  const goToSlide = React.useCallback((index) => {
    if (index >= 0 && index < validImages.length) {
      setCurrentIndex(index);
    }
  }, [validImages.length]);

  const togglePlayPause = React.useCallback(() => {
    if (validImages.length > 1) {
      setIsPlaying((prev) => !prev);
    }
  }, [validImages.length]);

  const toggleFullscreen = async () => {
    const slideshow = document.getElementById("slideshow-container");
    if (!slideshow) return;

    try {
      if (!isFullscreen) {
        await slideshow.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen operation failed:", err);
    }
  };

  const toggleLike = React.useCallback((imageIndex) => {
    setLikedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageIndex)) {
        newSet.delete(imageIndex);
      } else {
        newSet.add(imageIndex);
      }
      return newSet;
    });
  }, []);

  const handleImageLoad = React.useCallback((index) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  const handleImageError = React.useCallback((e, index) => {
    console.warn(`Image ${index} failed to load, using fallback`);
    setImageLoadErrors((prev) => new Set(prev).add(index));
    
    // Use a fallback image
    const fallbackIndex = index % fallbackImages.length;
    e.target.src = fallbackImages[fallbackIndex];
  }, [fallbackImages]);

  const shareImage = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title || "Healthcare Image",
          text: description || "Check out this healthcare facility",
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const downloadImage = () => {
    try {
      const currentImage = validImages[currentIndex];
      const link = document.createElement("a");
      link.href = currentImage;
      link.download = `${title || "image"}-${currentIndex + 1}.jpg`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback: open in new tab
      window.open(validImages[currentIndex], '_blank');
    }
  };

  // FIXED: Reset currentIndex when validImages changes
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [validImages]);

  if (!validImages || validImages.length === 0) {
    return (
      <div className="w-full h-80 bg-gradient-to-br from-[#1e40af]/5 to-[#10b981]/5 rounded-3xl flex items-center justify-center border border-gray-200/50 shadow-lg">
        <div className="text-center text-gray-600">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1e40af]/10 to-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid3X3 className="w-8 h-8 text-[#1e40af]" />
          </div>
          <p className="font-semibold text-lg text-gray-700">No images available</p>
          <p className="text-sm text-gray-500 mt-1">Images will appear here when available</p>
        </div>
      </div>
    );
  }

  const getImageSrc = (index) => {
    if (imageLoadErrors.has(index)) {
      return fallbackImages[index % fallbackImages.length];
    }
    return validImages[index];
  };

  return (
    <div id="slideshow-container" className="w-full">
      {/* Main Slideshow Container */}
      <div
        className={`${
          isFullscreen
            ? "fixed inset-0 z-50 bg-black"
            : "relative w-full h-80 md:h-96 lg:h-[520px] rounded-3xl overflow-hidden group shadow-2xl border border-gray-200/50 bg-white/95 backdrop-blur-sm"
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Main Image Container */}
        <div className="relative w-full h-full">
          {validImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={getImageSrc(index)}
                alt={`${title || "Image"} - ${index + 1}`}
                className="w-full h-full object-cover"
                onLoad={() => handleImageLoad(index)}
                onError={(e) => handleImageError(e, index)}
                loading={index === 0 ? "eager" : "lazy"}
              />
              {!loadedImages.has(index) && !imageLoadErrors.has(index) && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-[#1e40af] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ))}

          {/* Image Counter */}
          {validImages.length > 1 && (
            <div className="absolute top-5 right-5 bg-black/60 backdrop-blur-lg text-white px-3 py-2 rounded-full text-sm font-semibold z-20">
              <div className="flex items-center gap-2">
                <span>{currentIndex + 1}</span>
                <span>/</span>
                <span>{validImages.length}</span>
              </div>
            </div>
          )}

          {/* Title */}
          {title && showInfo && (
            <div className="absolute top-5 left-5 max-w-sm z-20">
              <div className="bg-white/90 backdrop-blur-lg rounded-xl px-4 py-3 shadow-lg">
                <h3 className="text-gray-800 font-bold text-lg">{title}</h3>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div
            className={`absolute top-5 right-5 flex gap-2 transition-all duration-300 z-20 ${
              isHovering || isFullscreen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <button
              onClick={() => toggleLike(currentIndex)}
              className={`bg-white/90 hover:bg-white backdrop-blur-lg rounded-full p-2 transition-all duration-200 ${
                likedImages.has(currentIndex) ? "text-red-500" : "text-gray-600"
              }`}
              aria-label={likedImages.has(currentIndex) ? "Unlike image" : "Like image"}
            >
              <Heart className={`w-4 h-4 ${likedImages.has(currentIndex) ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={shareImage}
              className="bg-white/90 hover:bg-white backdrop-blur-lg text-gray-600 rounded-full p-2 transition-all duration-200"
              aria-label="Share image"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={downloadImage}
              className="bg-white/90 hover:bg-white backdrop-blur-lg text-gray-600 rounded-full p-2 transition-all duration-200"
              aria-label="Download image"
            >
              <Download className="w-4 h-4" />
            </button>
            {description && showInfo && (
              <button
                onClick={() => setShowDescription(!showDescription)}
                className={`bg-white/90 hover:bg-white backdrop-blur-lg rounded-full p-2 transition-all duration-200 ${
                  showDescription ? "text-[#1e40af]" : "text-gray-600"
                }`}
                aria-label={showDescription ? "Hide description" : "Show description"}
              >
                <Info className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={toggleFullscreen}
              className="bg-white/90 hover:bg-white backdrop-blur-lg text-gray-600 rounded-full p-2 transition-all duration-200"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-lg text-gray-600 rounded-full p-2 transition-all duration-200 z-20 ${
                  isHovering || isFullscreen ? "opacity-100" : "opacity-0"
                }`}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-lg text-gray-600 rounded-full p-2 transition-all duration-200 z-20 ${
                  isHovering || isFullscreen ? "opacity-100" : "opacity-0"
                }`}
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="flex items-center justify-between">
              {validImages.length > 1 && (
                <button
                  onClick={togglePlayPause}
                  className="bg-white/90 hover:bg-white backdrop-blur-lg text-gray-600 rounded-full p-2 transition-all duration-200"
                  aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              )}
              {validImages.length > 1 && (
                <div className="flex space-x-2">
                  {validImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentIndex ? "bg-white scale-125" : "bg-white/60 hover:bg-white/80"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-lg px-2 py-1 rounded-full">
                <Heart className="w-3 h-3 text-red-500" />
                <span className="text-gray-700 text-sm font-medium">{likedImages.size}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {validImages.length > 1 && isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
              <div
                className="h-full bg-white transition-all duration-1000 ease-linear"
                style={{
                  width: `${((currentIndex + 1) / validImages.length) * 100}%`,
                }}
              />
            </div>
          )}

          {/* Description Overlay */}
          {showDescription && description && showInfo && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-30">
              <div className="bg-white rounded-xl p-4 max-w-md max-h-64 overflow-y-auto">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{title || "Image Details"}</h3>
                  <button
                    onClick={() => setShowDescription(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close description"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {showThumbnails && validImages.length > 1 && !isFullscreen && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden transition-all duration-200 ${
                index === currentIndex ? "ring-2 ring-[#1e40af] scale-105" : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Select thumbnail ${index + 1}`}
            >
              <img
                src={getImageSrc(index)}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const fallbackIndex = index % fallbackImages.length;
                  e.target.src = fallbackImages[fallbackIndex];
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlideshow;