import React, { useState } from "react";
import Image from "next/image";

interface FallbackImageProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  [key: string]: any;
}

const FallbackImage = ({
  src,
  alt,
  fallbackSrc,
  ...props
}: FallbackImageProps) => {
  const [isError, setIsError] = useState(false);

  if (isError || src === "null") {
    return <Image src={fallbackSrc} alt={alt} {...props} />;
  }

  return (
    <Image
      src={src !== "null" && src}
      alt={alt}
      {...props}
      onError={() => setIsError(true)}
    />
  );
};

export default FallbackImage;
