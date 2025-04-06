import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/lib/icons";
import { Helmet } from "react-helmet";

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: products } = useQuery<ProductsResponse>({
    queryKey: ['/api/products'],
  });

  const category = categorySlug && categories 
    ? categories.find(cat => cat.slug === categorySlug) 
    : null;

  const filteredProducts = products?.products.filter(product => {
    if (category) {
      return product.categoryId === category.id;
    }
    if (searchQuery) {
      return product.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  let pageTitle = "All Products - TUHO";
  let metaDescription = "Browse our complete selection of organic, healthy food products. Find nuts, granola bars, cereals and more.";

  if (category) {
    pageTitle = `${category.name} - TUHO`;
    metaDescription = `Explore our selection of organic ${category.name.toLowerCase()} at TUHO.`;
  } else if (searchQuery) {
    pageTitle = `Search Results: "${searchQuery}" - TUHO`;
    metaDescription = `Discover products matching "${searchQuery}" in our organic food collection.`;
  }

  return (
    <>
      <Helmet>
        <title>Sản Phẩm Organic & Healthy | TUHO - Thực Phẩm Dinh Dưỡng</title>
        <meta
          name="description"
          content="Khám phá các sản phẩm organic và healthy từ TUHO: granola, thanh gạo lứt, bánh kẹp rong biển, ngũ cốc và hạt dinh dưỡng. ✓ 100% Tự Nhiên ✓ Giao Hàng Nhanh"
        />
        <meta name="keywords" content="mua granola, mua gạo lứt, bánh kẹp rong biển, ngũ cốc organic, hạt dinh dưỡng, thực phẩm healthy" />
      </Helmet>

      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/">
                <ArrowLeftIcon className="h-4 w-4" />
                Quay lại trang chủ
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {filteredProducts && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}