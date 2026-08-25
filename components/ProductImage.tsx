import Image from "next/image";
import { ImageOff } from "lucide-react";

type Props = {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * Drop-in replacement for next/image inside a `relative` container, used
 * anywhere a product image is shown. Falls back to a local placeholder
 * instead of an external URL when the product has no image, so the page
 * never depends on a third-party host being reachable.
 */
export default function ProductImage({ src, alt, sizes, className = "", priority }: Props) {
  if (!src) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center bg-gray-light text-gray-muted/40 ${className}`}>
        <ImageOff size={22} strokeWidth={1.5} />
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} className={className} priority={priority} />;
}
