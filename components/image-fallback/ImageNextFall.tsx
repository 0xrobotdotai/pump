import { useState } from "react";
import { Image } from "@nextui-org/image";

interface ImageNextFallProps {
  src: string;
  fallbackSrc?: string;
  className?: string;
  alt?: string;
}

const ImageNextFall: React.FC<ImageNextFallProps> = ({ src, fallbackSrc = "/imgs/img-error.png", className, alt }) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [error, setError] = useState<boolean>(false);

  const handleError = () => {
    setImgSrc(fallbackSrc);
    setError(true);
  };

  return <>{error ? <div className={`rounded-xl text-xl h-[144px] font-bold text-white/80 flex items-center justify-center bg-black/80 ${className}`}>${alt}</div> : <Image src={imgSrc} alt={alt || "image"} className={className} onError={handleError} />}</>;
};

export default ImageNextFall;
