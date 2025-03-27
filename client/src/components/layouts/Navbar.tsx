import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { LeafIcon, Search, ShoppingCart, Menu, ChevronDown } from "@/lib/icons";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const { items, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { toast } = useToast();

  // Get all products for search
  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileProducts = () => {
    setMobileProductsOpen(!mobileProductsOpen);
  };

  const isActive = (path: string) => {
    return location === path ? "text-primary" : "text-neutral-900 hover:text-primary";
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      toast({
        title: "Search query is empty",
        description: "Please enter a product name to search",
        variant: "destructive"
      });
      return;
    }
    
    setShowSearchResults(false);
    setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };
  
  const filteredProducts = products 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        searchQuery.length > 0
      ).slice(0, 5) 
    : [];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <LeafIcon className="text-primary text-3xl mr-2" />
              <span className="text-xl font-bold font-poppins text-primary">NatureNutri</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-6">
              <Link href="/" className={`${isActive("/")} font-medium transition`}>
                Home
              </Link>
              <div className="relative group">
                <Link href="/products" className={`${isActive("/products")} font-medium transition flex items-center`}>
                  Products
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
                {/* Added margin-top gap to make hovering easier and improved hover transition */}
                <div className="absolute left-0 mt-0 pt-5 w-48 z-10 hidden group-hover:block">
                  <div className="bg-white shadow-lg rounded-md py-2 border border-gray-100">
                    <Link href="/products?category=nuts-seeds" className="block px-4 py-2 text-sm hover:bg-neutral-100">Nuts & Seeds</Link>
                    <Link href="/products?category=granola-bars" className="block px-4 py-2 text-sm hover:bg-neutral-100">Granola Bars</Link>
                    <Link href="/products?category=cereals" className="block px-4 py-2 text-sm hover:bg-neutral-100">Cereals</Link>
                    <Link href="/products?category=dried-fruits" className="block px-4 py-2 text-sm hover:bg-neutral-100">Dried Fruits</Link>
                    <Link href="/products?category=superfoods" className="block px-4 py-2 text-sm hover:bg-neutral-100">Superfoods</Link>
                  </div>
                </div>
              </div>
              <Link href="/about" className={`${isActive("/about")} font-medium transition`}>
                About Us
              </Link>
              <Link href="/blog" className={`${isActive("/blog")} font-medium transition`}>
                Blog
              </Link>
              <Link href="/contact" className={`${isActive("/contact")} font-medium transition`}>
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <Input 
                  type="text" 
                  placeholder="Search products..." 
                  className="pl-10 pr-4 py-2 rounded-full bg-neutral-100 focus:ring-2 focus:ring-primary w-64" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowSearchResults(false), 200);
                  }}
                />
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="h-4 w-4" />
                </button>
                
                {/* Search results dropdown */}
                {showSearchResults && filteredProducts.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-md py-2 z-50">
                    {filteredProducts.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/products/${product.slug}`}
                        className="block px-4 py-2 text-sm hover:bg-neutral-100 truncate"
                        onClick={() => setShowSearchResults(false)}
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                )}
              </form>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCart}
              className="relative p-2 hover:bg-neutral-100 rounded-full transition"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu} 
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <div className="pb-2">
                <form onSubmit={handleSearch} className="relative">
                  <Input 
                    type="text" 
                    placeholder="Search products..." 
                    className="pl-10 pr-4 py-2 rounded-full bg-neutral-100 focus:ring-2 focus:ring-primary w-full" 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(e.target.value.length > 0);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowSearchResults(false), 200);
                    }}
                  />
                  <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search className="h-4 w-4" />
                  </button>
                  
                  {/* Search results dropdown */}
                  {showSearchResults && filteredProducts.length > 0 && (
                    <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-md py-2 z-50">
                      {filteredProducts.map((product) => (
                        <Link 
                          key={product.id} 
                          href={`/products/${product.slug}`}
                          className="block px-4 py-2 text-sm hover:bg-neutral-100 truncate"
                          onClick={() => {
                            setShowSearchResults(false);
                            setMobileMenuOpen(false);
                          }}
                        >
                          {product.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </form>
              </div>
              <Link href="/" className="text-neutral-900 hover:text-primary font-medium py-2 transition">
                Home
              </Link>
              <div>
                <button 
                  onClick={toggleMobileProducts}
                  className="text-neutral-900 hover:text-primary font-medium py-2 transition w-full text-left flex justify-between items-center"
                >
                  Products
                  <ChevronDown className="h-4 w-4" />
                </button>
                {mobileProductsOpen && (
                  <div className="pl-4 py-2 space-y-2">
                    <Link href="/products?category=nuts-seeds" className="block py-1 text-neutral-900 hover:text-primary">
                      Nuts & Seeds
                    </Link>
                    <Link href="/products?category=granola-bars" className="block py-1 text-neutral-900 hover:text-primary">
                      Granola Bars
                    </Link>
                    <Link href="/products?category=cereals" className="block py-1 text-neutral-900 hover:text-primary">
                      Cereals
                    </Link>
                    <Link href="/products?category=dried-fruits" className="block py-1 text-neutral-900 hover:text-primary">
                      Dried Fruits
                    </Link>
                    <Link href="/products?category=superfoods" className="block py-1 text-neutral-900 hover:text-primary">
                      Superfoods
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/about" className="text-neutral-900 hover:text-primary font-medium py-2 transition">
                About Us
              </Link>
              <Link href="/blog" className="text-neutral-900 hover:text-primary font-medium py-2 transition">
                Blog
              </Link>
              <Link href="/contact" className="text-neutral-900 hover:text-primary font-medium py-2 transition">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
