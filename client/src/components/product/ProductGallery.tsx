import { useState, useEffect } from "react";
import { ProductImage } from "@shared/schema";
import { ChevronLeftIcon, ChevronRightIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  productImages: ProductImage[];
  fallbackImage?: string;
}

export default function ProductGallery({ productImages, fallbackImage }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // If no product images, use the fallback
  const images = productImages.length > 0 
    ? [...productImages].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) 
    : (fallbackImage ? [{ id: 0, productId: 0, imagePath: fallbackImage, isMain: true, displayOrder: 1, createdAt: new Date() }] : []);
  
  // Find the main image
  const mainImageIndex = images.findIndex(img => img.isMain) !== -1 
    ? images.findIndex(img => img.isMain) 
    : 0;
  
  // Initialize with main image
  useEffect(() => {
    setCurrentImageIndex(mainImageIndex);
  }, [mainImageIndex]);

  if (images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main large image with navigation buttons */}
      <div className="relative rounded-lg overflow-hidden bg-white border border-gray-200">
        <div className="aspect-square">
          <img
            src={images[currentImageIndex]?.imagePath}
            alt="Product"
            loading="lazy"
            width="600"
            height="600"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        
        {images.length > 1 && (
          <>
            <Button 
              onClick={prevImage}
              variant="outline" 
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
            
            <Button 
              onClick={nextImage}
              variant="outline" 
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
      
      {/* Thumbnail images */}
      {images.length > 1 && (
        <div className="flex overflow-x-auto gap-2 pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`flex-shrink-0 w-16 h-16 border-2 rounded-md overflow-hidden ${
                index === currentImageIndex 
                  ? "border-primary" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image.imagePath}
                alt={`Product thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}