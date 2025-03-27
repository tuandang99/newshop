import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product, Category } from "@shared/schema";

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
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";

interface ProductListProps {
  categorySlug?: string;
}

export default function ProductList({ categorySlug }: ProductListProps) {
  const [sort, setSort] = useState("featured");
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const searchQuery = searchParams.get('search');
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const { data: productsResponse, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ['/api/products'],
  });
  
  // Extract products from the response
  const allProducts = productsResponse?.products;
  
  // Find category if categorySlug is provided
  const category = categorySlug && categories
    ? categories.find(cat => cat.slug === categorySlug)
    : undefined;
  
  // Filter products by category and/or search query
  const products = allProducts
    ? allProducts.filter(product => {
        // Filter by category if specified
        if (categorySlug) {
          const categoryId = category?.id;
          if (categoryId && product.categoryId !== categoryId) {
            return false;
          }
        }
        
        // Filter by search query if specified
        if (searchQuery) {
          return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 product.description.toLowerCase().includes(searchQuery.toLowerCase());
        }
        
        return true;
      })
    : [];
  
  // Sort products based on selected option
  const sortedProducts = products ? [...products].sort((a, b) => {
    switch (sort) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default: // featured
        return 0; // Keep original order
    }
  }) : [];
  
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-poppins">
            {category ? category.name : "All Products"}
          </h2>
          <div className="animate-pulse w-32 h-10 bg-gray-200 rounded"></div>
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
    );
  }
  
  if (error || !products) {
    return (
      <div className="w-full text-center py-10">
        <h2 className="text-2xl font-bold font-poppins mb-4">
          {category ? category.name : "All Products"}
        </h2>
        <p className="text-red-500">Failed to load products. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold font-poppins mb-2 md:mb-0">
          {category 
            ? category.name 
            : searchQuery 
              ? `Search Results: "${searchQuery}"` 
              : "All Products"
          } 
          <span className="text-sm font-normal text-neutral-500 ml-2">
            ({sortedProducts.length} products)
          </span>
        </h2>
        
        <div className="flex items-center">
          <span className="mr-2 text-sm">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-neutral-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
      
      {sortedProducts.length === 0 ? (
        <div className="text-center py-10">
          <p>No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
