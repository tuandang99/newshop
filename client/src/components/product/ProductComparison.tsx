
import { useState } from "react";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface ProductComparisonProps {
  products: Product[];
}

export default function ProductComparison({ products }: ProductComparisonProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">So sánh sản phẩm</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {selectedProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
            <h4 className="font-medium mt-2">{product.name}</h4>
            <p className="text-primary font-semibold">{product.price.toLocaleString()}₫</p>
            <Button
              variant="outline"
              onClick={() => setSelectedProducts(products => products.filter(p => p.id !== product.id))}
              className="mt-2 w-full"
            >
              Xóa
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
