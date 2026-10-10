import React, { useState } from "react";

/**
 * SkeletonImage component
 * Displays an elegant Apple/macOS style shimmer skeleton loader while the image is loading.
 */
export default function SkeletonImage({
  src,
  alt = "",
  className = "",
  containerClassName = "",
  onDoubleClick,
  onClick,
  style = {},
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Skeleton Shimmer */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 bg-white/10 dark:bg-white/5 backdrop-blur-[2px] animate-pulse flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          <svg
            className="w-6 h-6 text-white/30 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        style={style}
        className={`transition-opacity duration-300 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
