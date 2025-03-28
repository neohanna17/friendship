import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
}

const ImageWithFallback = ({ 
  src, 
  fallback, 
  alt,
  className 
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallback);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc || fallback}
      alt={alt}
      onError={handleError}
      className={className}
    />
  );
};

export default ImageWithFallback;