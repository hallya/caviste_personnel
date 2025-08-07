import { memo, useRef, useEffect, useState } from "react";

interface VideoBackgroundProps {
  src: string;
  isVisible: boolean;
  isSelected: boolean;
  className?: string;
}

export const VideoBackground = memo(function VideoBackground({
  src,
  isVisible,
  isSelected,
  className = "",
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!videoRef.current || !isVisible) return;

    const video = videoRef.current;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setHasError(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [isVisible]);

  useEffect(() => {
    if (!videoRef.current || !isLoaded) return;

    const video = videoRef.current;

    if (isSelected && isVisible) {
      video.currentTime = 0;
      video.play().catch(() => {
      });
    } else if (!isSelected || !isVisible) {
      video.pause();
      video.currentTime = 0;
    }
  }, [isSelected, isVisible, isLoaded]);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    const handleEnded = () => {
      console.log('Video ended');
    };

    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  if (hasError) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
        isSelected && isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
      role="presentation"
    >
      <source src={src} type="video/mp4" />
      <source src={src.replace('.mp4', '.webm')} type="video/webm" />
      <p className="sr-only">Vidéo de fond décorative pour {src}</p>
    </video>
  );
}); 