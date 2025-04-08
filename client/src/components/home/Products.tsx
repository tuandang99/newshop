import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";
import { ArrowRightIcon } from "@/lib/icons";

// Define the API response structure
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

  const { data: productsResponse, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ['/api/featured-products'],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Extract products from the response
  const products = productsResponse?.products;

  const filteredProducts = products && activeFilter !== 'all' && categories
    ? products.filter(product => {
        const category = categories.find(cat => cat.slug === activeFilter);
        return category ? product.category_id === category.id : true;
      })
    : products;

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold font-poppins mb-2">Danh mục sản phẩm</h2>
              <p className="text-neutral-700">Lựa chọn những sản phẩm tốt nhất</p>
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

  if (error || !products) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-poppins mb-2">Danh mục sản phẩm</h2>
          <p className="text-red-500">Failed to load products. Please try again later.</p>
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
            <p className="text-neutral-700">Lựa chọn những sản phẩm tốt </p>
          </div>
          <div className="relative w-full md:w-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row gap-2 mt-4 md:mt-0">
              <Button 
                variant={activeFilter === 'all' ? 'default' : 'outline'} 
                onClick={() => setActiveFilter('all')}
                className={`w-full md:w-auto justify-center ${activeFilter === 'all' ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'}`}
              >
                Tất cả
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={activeFilter === category.slug ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(category.slug)}
                  className={`w-full md:w-auto justify-center text-center ${activeFilter === category.slug ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'}`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts && filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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