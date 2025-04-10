
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "@/components/ui/cart-drawer";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100 text-neutral-900">
      <Navbar />
      <CartDrawer />
      <AnimatePresence mode="wait">
        <motion.main 
          key={location}
          className="flex-grow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
