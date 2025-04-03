import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { LeafIcon, SearchIcon, ShoppingCartIcon, MenuIcon, ChevronDownIcon } from "@/lib/icons";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

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

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const { items, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { toast } = useToast();

  // Get all products for search
  const { data: productsResponse } = useQuery<ProductsResponse>({
    queryKey: ['/api/products'],
  });

  // Extract products from the response
  const products = productsResponse?.products;

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
        title: "Truy vấn tìm kiếm trống",
        description: "Vui lòng nhập tên sản phẩm để tìm kiếm",
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
      <div className="container mx-auto px-2 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <LeafIcon className="text-primary text-3xl mr-1" />
              <span className="text-xl font-bold font-poppins text-primary truncate max-w-[120px] sm:max-w-none">NatureNutri</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-6">
              <Link href="/" className={`${isActive("/")} font-medium transition`}>
                Trang Chủ
              </Link>
              <div className="relative group">
                <Link href="/products" className={`${isActive("/products")} font-medium transition flex items-center`}>
                  Sản Phẩm
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </Link>
                {/* Added margin-top gap to make hovering easier and improved hover transition */}
                <div className="absolute left-0 mt-0 pt-5 w-48 z-10 hidden group-hover:block">
                  <div className="bg-white shadow-lg rounded-md py-2 border border-gray-100">
                    <Link href="/products?category=nuts-seeds" className="block px-4 py-2 text-sm hover:bg-neutral-100">Các Loại Hạt</Link>
                    <Link href="/products?category=granola-bars" className="block px-4 py-2 text-sm hover:bg-neutral-100">Thanh Ngũ Cốc</Link>
                    <Link href="/products?category=cereals" className="block px-4 py-2 text-sm hover:bg-neutral-100">Ngũ Cốc</Link>
                    <Link href="/products?category=dried-fruits" className="block px-4 py-2 text-sm hover:bg-neutral-100">Trái Cây Sấy</Link>
                    <Link href="/products?category=superfoods" className="block px-4 py-2 text-sm hover:bg-neutral-100">Thực Phẩm Chức Năng</Link>
                  </div>
                </div>
              </div>
              <Link href="/about" className={`${isActive("/about")} font-medium transition`}>
                Về Chúng Tôi
              </Link>
              <Link href="/blog" className={`${isActive("/blog")} font-medium transition`}>
                Tin Tức
              </Link>
              <Link href="/contact" className={`${isActive("/contact")} font-medium transition`}>
                Liên Hệ
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <Input 
                  type="text" 
                  placeholder="Tìm kiếm sản phẩm..." 
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
                  <SearchIcon className="h-4 w-4" />
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
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu} 
              className="md:hidden p-1 sm:p-2"
              aria-label="Menu"
            >
              <MenuIcon className="h-5 w-5 sm:h-6 sm:w-6" />
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
                    placeholder="Tìm kiếm sản phẩm..." 
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
                    <SearchIcon className="h-4 w-4" />
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
                Trang Chủ
              </Link>
              <div>
                <button 
                  onClick={toggleMobileProducts}
                  className="text-neutral-900 hover:text-primary font-medium py-2 transition w-full text-left flex justify-between items-center"
                >
                  Sản Phẩm
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                {mobileProductsOpen && (
                  <div className="pl-4 py-2 space-y-2">
                    <Link href="/products?category=nuts-seeds" className="block py-1 text-neutral-900 hover:text-primary">
                      Các Loại Hạt
                    </Link>
                    <Link href="/products?category=granola-bars" className="block py-1 text-neutral-900 hover:text-primary">
                      Thanh Ngũ Cốc
                    </Link>
                    <Link href="/products?category=cereals" className="block py-1 text-neutral-900 hover:text-primary">
                      Ngũ Cốc
                    </Link>
                    <Link href="/products?category=dried-fruits" className="block py-1 text-neutral-900 hover:text-primary">
                      Trái Cây Sấy
                    </Link>
                    <Link href="/products?category=superfoods" className="block py-1 text-neutral-900 hover:text-primary">
                      Thực Phẩm Chức Năng
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/about" className="text-neutral-900 hover:text-primary font-medium py-2 transition">
                Về Chúng Tôi
              </Link>
              <Link href="/blog" className="text-neutral-900 hover:text-primary font-medium py-2 transition">
                Tin Tức
              </Link>
              <Link href="/contact" className="text-neutral-900 hover:text-primary font-medium py-2 transition">
                Liên Hệ
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}