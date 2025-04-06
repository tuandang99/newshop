
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import ProductCard from "@/components/product/ProductCard";
import ProductFilter from "@/components/product/ProductFilter";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/lib/icons";
import { Helmet } from "react-helmet";

interface FilterState {
  search: string;
  category: string | null;
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const [filters, setFilters] = useState<FilterState>({
    search: searchQuery || '',
    category: categorySlug || null,
    minPrice: 0,
    maxPrice: 1000000,
    minRating: 0
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: products } = useQuery<ProductsResponse>({
    queryKey: ['/api/products'],
  });

  const handleFilter = (newFilters: FilterState) => {
    console.log('Applying new filters:', newFilters);
    setFilters(newFilters);
  };

  const filteredProducts = products?.products.filter(product => {
    console.log("Filtering product:", product.name);
    console.log("Current category:", filters.category);
    console.log("Product categoryId:", product.categoryId);

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category) {
      const category = categories?.find(cat => cat.slug === filters.category);
      if (!category) return true; // If category not found, show all products
      return product.categoryId === category.id;
    }

    // Price filter
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    // Rating filter
    if (product.rating < filters.minRating) {
      return false;
    }

    return true;
  });

  return (
    <>
      <Helmet>
        <title>Sản Phẩm Organic & Healthy | TUHO - Thực Phẩm Dinh Dưỡng</title>
        <meta
          name="description"
          content="Khám phá các sản phẩm organic và healthy từ TUHO: granola, thanh gạo lứt, bánh kẹp rong biển, ngũ cốc và hạt dinh dưỡng."
        />
      </Helmet>

      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <ProductFilter 
                selectedCategory={categorySlug || ''} 
                onFilter={handleFilter}
                initialFilters={{
                  search: searchQuery || '',
                  category: categorySlug || '',
                  priceRange: [filters.minPrice, filters.maxPrice],
                  rating: filters.minRating
                }}
              />
            </div>
            
            <div className="md:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                  {filters.category 
                    ? categories?.find(cat => cat.slug === filters.category)?.name 
                    : "Tất cả sản phẩm"}
                </h1>
                <Button asChild variant="outline">
                  <Link href="/">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Quay lại
                  </Link>
                </Button>
              </div>

              {filteredProducts && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
