import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";
import { ArrowRightIcon } from "@/lib/icons";

interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function Products() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Thay đổi API endpoint từ featured-products sang products
  const { data: productsResponse } = useQuery<ProductsResponse>({
    queryKey: ['/api/products'],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const products = productsResponse?.products || [];

  // Apply the same filtering logic as in the Products page
  const filteredProducts = products.filter(product => {
    // Skip category filter if set to "all"
    if (activeFilter === 'all') return true;

    // Category filter logic
    const category = categories?.find(cat => cat.slug === activeFilter);
    
    if (!category) return false;
    
    return product.categoryId === category.id;
  }).slice(0, 8); // Limit to 8 products

  if (!products || !categories) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold font-poppins mb-2">Danh mục sản phẩm</h2>
              <p className="text-neutral-700">Lựa chọn những sản phẩm tốt</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="w-full h-56 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold font-poppins mb-2">Danh mục sản phẩm</h2>
            <p className="text-neutral-700">Lựa chọn những sản phẩm tốt</p>
          </div>
          <div className="relative w-full md:w-auto">
            <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-4 md:mt-0 overflow-x-auto pb-1">
              <Button 
                variant={activeFilter === 'all' ? 'default' : 'outline'} 
                onClick={() => setActiveFilter('all')}
                className={`whitespace-nowrap justify-center ${activeFilter === 'all' ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'}`}
              >
                Tất cả
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={activeFilter === category.slug ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(category.slug)}
                  className={`whitespace-nowrap justify-center text-center ${activeFilter === category.slug ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'}`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Sản phẩm grid - điều chỉnh để tránh overflow */}
        <div className="w-full">
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-neutral-500">Không tìm thấy sản phẩm trong danh mục này</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-10">
          <Button 
            variant="outline" 
            asChild
            className="border-primary text-primary hover:bg-primary/10 inline-flex items-center"
          >
            <Link href="/products">
              Xem tất cả sản phẩm
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}