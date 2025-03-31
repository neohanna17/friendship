import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string | null;
  fallback: string;
  alt: string;
  className?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallback,
  alt,
  className,
  ...props
}) => {
  const [error, setError] = useState(false);
  
  const handleError = () => {
    setError(true);
  };
  
  return (
    <img
      src={(!src || error) ? fallback : src}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};

export default ImageWithFallback;