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
  const searchQuery = searchParams.get('search');
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const category = categorySlug && categories 
    ? categories.find(cat => cat.slug === categorySlug) 
    : null;
  
  let pageTitle = "All Products - NatureNutri";
  let metaDescription = "Browse our complete selection of organic, healthy food products. Find nuts, granola bars, cereals and more.";
  
  if (category) {
    pageTitle = `${category.name} - NatureNutri`;
    metaDescription = `Explore our selection of organic ${category.name.toLowerCase()} at NatureNutri.`;
  } else if (searchQuery) {
    pageTitle = `Search Results: "${searchQuery}" - NatureNutri`;
    metaDescription = `Discover products matching "${searchQuery}" in our organic food collection.`;
  }
  
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
