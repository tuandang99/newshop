import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, normalizeVietnameseText } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { LeafIcon, SearchIcon, ShoppingCartIcon, MenuIcon, ChevronDownIcon } from "@/lib/icons";
import { Category, Product } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function Navbar() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  const [location, setLocation] = useLocation();
  const { items, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { toast } = useToast();

  const { data: productsResponse } = useQuery<ProductsResponse>({
    queryKey: ['/api/products'],
  });

  const products = productsResponse?.products;
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      toast({
        title: "Truy vấn tìm kiếm trống",
        description: "Vui lòng nhập tên sản phẩm để tìm kiếm",
        variant: "destructive"
      });
      return;
    }
    setShowSearchResults(false);
    setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setMobileMenuOpen(false);
  };

  const filteredProducts = products 
    ? products.filter(product => {
        if (searchQuery.length === 0) return false;
        const normalizedQuery = normalizeVietnameseText(searchQuery);
        const normalizedName = normalizeVietnameseText(product.name);
        return normalizedName.includes(normalizedQuery);
      }).slice(0, 5) 
    : [];

  const isActive = (path: string) => {
    return location === path ? "text-primary" : "text-neutral-900 hover:text-primary";
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setShowSearchResults(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-2 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0" onClick={closeMenu}>
            <img src="/logo.png" alt="TUHO Logo" className="h-8 sm:h-10 md:h-12 w-auto mr-2" />
            <span className="text-base sm:text-lg md:text-xl font-bold truncate" style={{ fontFamily: 'Chewy', color: 'rgba(43,136,65,255)' }}>Tuho Healthy Foods</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
            <Link href="/" className={`${isActive("/")} font-medium transition px-2`}>
              Trang Chủ
            </Link>
            <div className="relative group">
              <Link href="/products" className={`${isActive("/products")} font-medium transition flex items-center gap-1 px-2`}>
                Sản Phẩm
                <ChevronDownIcon className="h-4 w-4" />
              </Link>
              <div className="absolute left-0 mt-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white shadow-lg rounded-md py-2 border border-gray-100">
                  {categories?.map((category) => (
                    <Link 
                      key={category.id}
                      href={`/products?category=${category.slug}`} 
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 transition-colors"
                      onClick={closeMenu}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/about" className={`${isActive("/about")} font-medium transition px-2`}>
              Về Chúng Tôi
            </Link>
            <Link href="/blog" className={`${isActive("/blog")} font-medium transition px-2`}>
              Tin Tức
            </Link>
            <Link href="/contact" className={`${isActive("/contact")} font-medium transition px-2`}>
              Liên Hệ
            </Link>
          </div>

          {/* Search and Cart */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <Input 
                  type="text" 
                  placeholder="Tìm kiếm sản phẩm..." 
                  className="pl-10 pr-4 py-2 rounded-full bg-neutral-100 focus:ring-2 focus:ring-primary w-48 lg:w-64" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon className="h-4 w-4" />
                </button>

                {showSearchResults && filteredProducts.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-md py-2 z-50 border border-gray-100">
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

            {/* Cart Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCart}
              className="relative p-1 sm:p-2 hover:bg-neutral-100 rounded-full transition"
              aria-label="Giỏ hàng"
            >
              <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-1 sm:p-2"
              aria-label="Menu"
            >
              <MenuIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[57px] sm:top-[65px] bg-white z-50 overflow-y-auto pb-16">
            <div className="p-4 space-y-4">
              <div className="pb-2">
                <form onSubmit={handleSearch} className="relative">
                  <Input 
                    type="text" 
                    placeholder="Tìm kiếm sản phẩm..." 
                    className="pl-10 pr-4 py-2 rounded-full bg-neutral-100 focus:ring-2 focus:ring-primary w-full" 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(e.target.value.length > 0);
                    }}
                  />
                  <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <SearchIcon className="h-4 w-4" />
                  </button>
                </form>
                {showSearchResults && filteredProducts.length > 0 && (
                  <div className="mt-2 bg-white rounded-md border border-gray-100">
                    {filteredProducts.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/products/${product.slug}`}
                        className="block px-4 py-2 text-sm hover:bg-neutral-100 truncate"
                        onClick={closeMenu}
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href="/" 
                className="block py-2 text-lg font-medium hover:text-primary transition"
                onClick={closeMenu}
              >
                Trang Chủ
              </Link>

              <div className="py-2">
                <Link
                  href="/products"
                  className="block text-lg font-medium hover:text-primary transition mb-2"
                  onClick={closeMenu}
                >
                  Sản Phẩm
                </Link>
                <div className="pl-4 space-y-2">
                  {categories?.map((category) => (
                    <Link 
                      key={category.id}
                      href={`/products?category=${category.slug}`} 
                      className="block py-1 text-neutral-900 hover:text-primary transition"
                      onClick={closeMenu}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link 
                href="/about" 
                className="block py-2 text-lg font-medium hover:text-primary transition"
                onClick={closeMenu}
              >
                Về Chúng Tôi
              </Link>
              <Link 
                href="/blog" 
                className="block py-2 text-lg font-medium hover:text-primary transition"
                onClick={closeMenu}
              >
                Tin Tức
              </Link>
              <Link 
                href="/contact" 
                className="block py-2 text-lg font-medium hover:text-primary transition"
                onClick={closeMenu}
              >
                Liên Hệ
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}