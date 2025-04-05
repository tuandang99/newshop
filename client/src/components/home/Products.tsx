import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
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

  // Extract products from the response
  const products = productsResponse?.products;

  const filteredProducts = products && activeFilter !== 'all'
    ? products.filter(product => {
        switch (activeFilter) {
          case 'nuts':
            return product.categoryId === 1; // Nuts & Seeds
          case 'bars':
            return product.categoryId === 2; // Granola Bars
          case 'cereals':
            return product.categoryId === 3; // Cereals
          default:
            return true;
        }
      })
    : products;

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold font-poppins mb-2">Featured Products</h2>
              <p className="text-neutral-700">Handpicked selection of our best sellers</p>
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
          <h2 className="text-3xl font-bold font-poppins mb-2">Featured Products</h2>
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
            <h2 className="text-3xl font-bold font-poppins mb-2">Featured Products</h2>
            <p className="text-neutral-700">Handpicked selection of our best sellers</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              onClick={() => setActiveFilter('all')}
              className={activeFilter === 'all' ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'}
            >
              All
            </Button>
            <Button 
              variant={activeFilter === 'nuts' ? 'default' : 'outline'} 
              onClick={() => setActiveFilter('nuts')}
              className={activeFilter === 'nuts' ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'}
            >
              Nuts
            </Button>
            <Button 
              variant={activeFilter === 'bars' ? 'default' : 'outline'} 
              onClick={() => setActiveFilter('bars')}
              className={activeFilter === 'bars' ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'}
            >
              Bars
            </Button>
            <Button 
              variant={activeFilter === 'cereals' ? 'default' : 'outline'} 
              onClick={() => setActiveFilter('cereals')}
              className={activeFilter === 'cereals' ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200'}
            >
              Cereals
            </Button>
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
              View All Products
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}