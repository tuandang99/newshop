import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { StarFilledIcon, ShoppingCartIcon } from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
    <div className="product-card bg-white rounded-lg shadow-sm overflow-hidden relative">
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
      <Link href={`/products/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={400}
          height={224}
          className="w-full h-56 object-cover"
        />
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-lg font-poppins">{product.name}</h3>
          <div className="flex items-center">
            <span className="text-amber-500 text-sm">
              {product.rating.toFixed(1)}
            </span>
            <StarFilledIcon className="text-amber-500 ml-1 h-4 w-4" />
          </div>
        </div>
        <p className="text-neutral-600 text-sm mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-semibold">
              {product.price.toLocaleString("vi-VN")}₫
            </span>
            {product.oldPrice && (
              <span className="text-sm line-through text-neutral-500 ml-2">
                {product.oldPrice.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>
          <div className="product-cta opacity-0 transform translate-y-2 transition-all">
            <Button
              size="icon"
              className="bg-primary text-white p-2 rounded-full hover:bg-primary/90"
              onClick={handleAddToCart}
            >
              <ShoppingCartIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}