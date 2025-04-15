
import { Helmet } from "react-helmet";

function generateProductSchema(product: any) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "VND"
    }
  };
}

import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { StarFilledIcon, ShoppingCartIcon } from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} đã được thêm vào giỏ hàng`,
    });
  };

  // Labels for product badges
  const renderBadges = () => {
    // Only show one badge on the left and one on the right to avoid overlap
    return (
      <>
        {/* Right side badge - discount */}
        {product.oldPrice && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </span>
        )}
        
        {/* Left side badge - priority order: bestseller > new > organic */}
        {product.isBestseller ? (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full z-10">
            Bán chạy
          </span>
        ) : product.isNew ? (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full z-10">
            Mới
          </span>
        ) : product.isOrganic ? (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full z-10">
            Hữu cơ
          </span>
        ) : null}
      </>
    );
  };

  return (
    <div className="product-card bg-white rounded-lg shadow-sm overflow-hidden relative hover:shadow-md transition-all group">
      {renderBadges()}
      
      <Link href={`/products/${product.slug}`} onClick={() => window.scrollTo(0, 0)}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={400}
          height={224}
          className={`w-full object-cover ${variant === 'compact' ? 'h-28 sm:h-32' : 'h-40 max-h-[200px]'}`}
        />
      </Link>
      
      <div className={variant === 'compact' ? 'p-2 sm:p-3' : 'p-4'}>
        {/* Title and rating */}
        <div className="flex justify-between items-start mb-1">
          <h3 className={`font-semibold font-poppins ${variant === 'compact' ? 'text-sm line-clamp-1' : 'text-base'}`}>
            {product.name}
          </h3>
          {variant !== 'compact' && (
            <div className="flex items-center">
              <span className="text-amber-500 text-sm">
                {product.rating.toFixed(1)}
              </span>
              <StarFilledIcon className="text-amber-500 ml-1 h-4 w-4" />
            </div>
          )}
        </div>
        
        {/* Description - hide in compact view */}
        {variant !== 'compact' && (
          <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        )}
        
        {/* Price area */}
        <div className="flex flex-wrap justify-between items-start">
          <div className="flex flex-col mb-2 mr-2">
            <div className="flex items-center gap-1">
              <span className={`font-semibold text-red-500 ${variant === 'compact' ? 'text-sm' : 'text-lg'}`}>
                {product.price.toLocaleString("vi-VN")}₫
              </span>
              {product.oldPrice && variant !== 'compact' && (
                <span className="text-sm line-through text-neutral-500 ml-1">
                  {product.oldPrice.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>
            {product.oldPrice && variant !== 'compact' && (
              <span className="text-xs text-red-500">
                Giảm {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
              </span>
            )}
          </div>
          
          {/* Buy button - Always show on small screen, hover on desktop */}
          {variant !== 'compact' && (
            <div className="mt-1 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
              <Button
                variant="default"
                size="sm"
                className="bg-primary text-white hover:bg-primary/90 text-xs sm:text-sm"
                onClick={handleAddToCart}
              >
                <ShoppingCartIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Mua ngay
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
