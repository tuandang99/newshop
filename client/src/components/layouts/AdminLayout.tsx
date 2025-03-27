import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  DashboardIcon, 
  ProductsIcon, 
  OrdersIcon, 
  BlogIcon, 
  SettingsIcon,
  ShoppingCartIcon,
  CloseIcon,
  MenuIcon 
} from "@/lib/icons";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/admin", 
      icon: <DashboardIcon className="mr-2 h-4 w-4" /> 
    },
    { 
      name: "Products", 
      path: "/admin/products", 
      icon: <ProductsIcon className="mr-2 h-4 w-4" /> 
    },
    { 
      name: "Categories", 
      path: "/admin/categories", 
      icon: <ProductsIcon className="mr-2 h-4 w-4" /> 
    },
    { 
      name: "Orders", 
      path: "/admin/orders", 
      icon: <OrdersIcon className="mr-2 h-4 w-4" /> 
    },
    { 
      name: "Blog", 
      path: "/admin/blog", 
      icon: <BlogIcon className="mr-2 h-4 w-4" /> 
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | NatureNutri</title>
      </Helmet>

      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile sidebar toggle */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </Button>
        )}

        {/* Sidebar */}
        <aside 
          className={`
            ${isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out' : 'relative'} 
            ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
            w-64 bg-white border-r border-gray-200 pb-10
          `}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <ShoppingCartIcon className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">NatureNutri</span>
              </Link>
            </div>
          </div>

          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500 uppercase">
              Management
            </h2>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={location === item.path ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    {item.icon}
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500 uppercase">
              System
            </h2>
            <div className="space-y-1">
              <Link href="/admin/settings">
                <Button 
                  variant={location === "/admin/settings" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
              
              <Link href="/">
                <Button 
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <ShoppingCartIcon className="mr-2 h-4 w-4" />
                  View Store
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          {children}
        </main>
      </div>
    </>
  );
}