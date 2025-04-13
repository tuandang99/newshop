import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category, Product } from "@shared/schema";
import ProductCard from "@/components/product/ProductCard";
import ProductFilter from "@/components/product/ProductFilter";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/lib/icons";
import { Helmet } from "react-helmet";

interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface FilterState {
  search: string;
  category: string | null;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  isOrganic?: boolean;
  isNew?: boolean;
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
    minRating: 0,
    isOrganic: false,
    isNew: false
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: products } = useQuery<ProductsResponse>({
    queryKey: ['/api/products'],
  });

  const handleFilter = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const filteredProducts = products?.products.filter(product => {
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
      if (!category) return true;
      if (!(product.categoryId === category.id)) {
        return false;
      }
    }

    // Organic filter
    if (filters.isOrganic) {
      console.log("Checking isOrganic:", product.name, product.isOrganic, (product as any).is_organic);
      if (!(product.isOrganic === true || (product as any).is_organic === true)) {
        return false;
      }
    }

    // New product filter
    if (filters.isNew) {
      console.log("Checking isNew:", product.name, product.isNew, (product as any).is_new);
      if (!(product.isNew === true || (product as any).is_new === true)) {
        return false;
      }
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

      <section className="py-8 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold font-poppins mb-2">
                {filters.category 
                  ? categories?.find(cat => cat.slug === filters.category)?.name 
                  : "Tất cả sản phẩm"}
              </h1>
              <p className="text-neutral-600">
                Khám phá các sản phẩm organic & healthy của chúng tôi
              </p>
            </div>
            <Button asChild variant="outline" className="hover:bg-primary/10">
              <Link href="/">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Trang chủ
              </Link>
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="sticky top-4">
                <ProductFilter 
                  selectedCategory={categorySlug || ''} 
                  onFilter={handleFilter}
                  initialFilters={{
                    search: searchQuery || '',
                    category: categorySlug || '',
                    priceRange: [filters.minPrice, filters.maxPrice],
                    rating: filters.minRating,
                    isOrganic: filters.isOrganic || false,
                    isNew: filters.isNew || false
                  }}
                />
              </div>
            </div>
            
            <div className="lg:w-3/4">
              {filteredProducts && filteredProducts.length > 0 ? (
                <>
                  <div className="text-sm text-neutral-600 mb-4">
                    Hiển thị {filteredProducts.length} sản phẩm
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-neutral-600 mb-2">Không tìm thấy sản phẩm phù hợp</p>
                  <p className="text-sm text-neutral-500">Vui lòng thử lại với bộ lọc khác</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}