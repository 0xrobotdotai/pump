import React, { useState } from "react";

interface MyImageProps {
  src: string;
  fallbackSrc?: string;
  className?: string;
  alt?: string;
}

const ImageFall: React.FC<MyImageProps> = ({ src, fallbackSrc = "/imgs/img-error.png", className, alt }) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [error, setError] = useState<boolean>(false);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.onerror = null;
    setError(true);
    setImgSrc(fallbackSrc);
  };

  

  return <>{error ? <div className="text-xl font-bold text-white/80 w-full h-full flex items-center justify-center bg-black/80">
    ${alt}
  </div> : <img src={imgSrc} alt={alt || "image"} className={className} onError={handleError} />}</>;
};

export default ImageFall;
