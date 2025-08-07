import { memo, useRef, useEffect, useState } from "react";

interface VideoBackgroundProps {
  src: string;
  isVisible: boolean;
  isSelected: boolean;
  className?: string;
}

const isSafariIOS = () => {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && /Safari/.test(ua) && !/Chrome/.test(ua);
};

export const VideoBackground = memo(function VideoBackground({
  src,
  isVisible,
  isSelected,
  className = "",
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const safari = isSafariIOS();
    setIsSafari(safari);
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setHasError(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(false);
    };

    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    const handleLoadStart = () => {};

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [src]);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (isSelected && isVisible) {
      video.currentTime = 0;

      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          setAttempts((prev) => prev + 1);

          if (isSafari && attempts < 3) {
            setTimeout(() => {
              video.play().catch(() => {});
            }, 1000);
          }
        }
      };

      playVideo();
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isSelected, isVisible, isLoaded, isSafari, attempts]);

  if (hasError && attempts >= 3) {
    return (
      <div
        className={`absolute inset-0 w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 transition-opacity duration-500 ease-in-out ${
          isSelected && isVisible ? "opacity-100" : "opacity-0"
        } ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          isSelected && isVisible ? "opacity-100" : "opacity-0"
        } ${className}`}
        muted
        playsInline
        preload="auto"
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="false"
        aria-hidden="true"
        role="presentation"
        loop={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
      >
        <source src={src} type="video/mp4" />
        <p className="sr-only">Vidéo de fond décorative pour {src}</p>
      </video>

      {isSafari && isSelected && isVisible && attempts > 0 && (
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current
                .play()
                .catch(() => {});
            }
          }}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-primary-600 px-2 py-1 rounded text-xs font-medium transition-colors z-tooltip"
          aria-label="Lire la vidéo"
        >
          ▶️ Lire
        </button>
      )}
    </>
  );
});
