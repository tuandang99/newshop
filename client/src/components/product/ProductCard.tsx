
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

  return (
    <div className="product-card bg-white rounded-lg shadow-sm overflow-hidden relative hover:shadow-md transition-all group">
      {product.oldPrice && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
          -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
        </span>
      )}
      {product.isNew && (
        <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full z-10">
          Mới
        </span>
      )}
      {product.oldPrice && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
          -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
        </span>
      )}
      {product.isOrganic && (
        <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full z-10">
          Hữu cơ
        </span>
      )}
      {product.isBestseller && (
        <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full z-10">
          Bán chạy
        </span>
      )}
      <Link href={`/products/${product.slug}`} onClick={() => window.scrollTo(0, 0)}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={400}
          height={224}
          className={`w-full object-cover ${variant === 'compact' ? 'h-32' : 'h-40 max-h-[200px]'}`}
        />
      </Link>
      <div className={variant === 'compact' ? 'p-3' : 'p-4'}>
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-base font-poppins">{product.name}</h3>
          <div className="flex items-center">
            <span className="text-amber-500 text-sm">
              {product.rating.toFixed(1)}
            </span>
            <StarFilledIcon className="text-amber-500 ml-1 h-4 w-4" />
          </div>
        </div>
        <p className="text-neutral-600 text-sm mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-red-500">
                {product.price.toLocaleString("vi-VN")}₫
              </span>
              {product.oldPrice ? (
                <span className="text-sm line-through text-neutral-500 ml-2">
                  {product.oldPrice.toLocaleString("vi-VN")}₫
                </span>
              ) : null}
            </div>
            {product.oldPrice && (
              <span className="text-xs text-red-500">
                Giảm {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
              </span>
            )}
          </div>
          <div className="product-cta opacity-0 transform translate-y-2 transition-all flex items-center gap-2">
            <Button
              className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 flex items-center gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCartIcon className="h-4 w-4" />
              <span>Mua ngay</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}