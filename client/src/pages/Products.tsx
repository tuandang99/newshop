import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import ProductList from "@/components/product/ProductList";
import { Helmet } from "react-helmet";

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const categorySlug = searchParams.get('category') || undefined;
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const category = categorySlug && categories 
    ? categories.find(cat => cat.slug === categorySlug) 
    : null;
  
  const pageTitle = category 
    ? `${category.name} - NatureNutri` 
    : "All Products - NatureNutri";
  
  const metaDescription = category
    ? `Explore our selection of organic ${category.name.toLowerCase()} at NatureNutri.`
    : "Browse our complete selection of organic, healthy food products. Find nuts, granola bars, cereals and more.";
  
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6">
            <ProductList categorySlug={categorySlug} />
          </div>
        </div>
      </section>
    </>
  );
}
