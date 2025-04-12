
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

  const { data: productsResponse } = useQuery<ProductsResponse>({
    queryKey: ['/api/featured-products'],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const products = productsResponse?.products || [];

  const filteredProducts = products.filter(product => {
    console.log('Filtering product:', { 
      name: product.name, 
      categoryId: product.categoryId,
      category_id: product.category_id 
    });

    // Category filter
    if (activeFilter !== 'all') {
      const category = categories?.find(cat => cat.slug === activeFilter);
      console.log('Active filter:', {
        filter: activeFilter,
        foundCategory: category ? { id: category.id, name: category.name } : null,
        matches: category ? (product.categoryId === category.id || product.category_id === category.id) : false
      });
      
      if (!category) return false;
      return product.categoryId === category.id || product.category_id === category.id;
    }
    return true;
  });

  if (!products || !categories) {
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

  return (
    <section id="products" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold font-poppins mb-2">Danh mục sản phẩm</h2>
            <p className="text-neutral-700">Lựa chọn những sản phẩm tốt nhất</p>
          </div>
          <div className="relative w-full md:w-auto">
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  Tất cả
                </button>
                {categories?.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === category.slug
                        ? 'bg-primary text-white'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button 
            variant="outline" 
            onClick={() => {
              window.scrollTo(0, 0);
              window.location.href = '/products';
            }}
            className="border-primary text-primary hover:bg-primary/10 inline-flex items-center"
          >
            Xem tất cả sản phẩm
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
