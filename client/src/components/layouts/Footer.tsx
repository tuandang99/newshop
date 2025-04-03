import { Link } from "wouter";
import { 
  LeafIcon, 
  FacebookIcon, 
  TwitterIcon, 
  InstagramIcon, 
  PinterestIcon 
} from "@/lib/icons";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <LeafIcon className="text-3xl mr-2 text-primary" />
              <span className="text-xl font-bold font-poppins text-white">NatureNutri</span>
            </div>
            <p className="text-neutral-400 mb-4">
              Premium organic foods for a healthier lifestyle. We bring nature's goodness directly to your table.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                <FacebookIcon className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                <TwitterIcon className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                <InstagramIcon className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                <PinterestIcon className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">Liên Kết Nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-neutral-400 hover:text-white transition">
                  Cửa Hàng
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-400 hover:text-white transition">
                  Tin Tức
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=nuts-seeds" className="text-neutral-400 hover:text-white transition">
                  Nuts & Seeds
                </Link>
              </li>
              <li>
                <Link href="/products?category=granola-bars" className="text-neutral-400 hover:text-white transition">
                  Granola Bars
                </Link>
              </li>
              <li>
                <Link href="/products?category=cereals" className="text-neutral-400 hover:text-white transition">
                  Cereals
                </Link>
              </li>
              <li>
                <Link href="/products?category=dried-fruits" className="text-neutral-400 hover:text-white transition">
                  Dried Fruits
                </Link>
              </li>
              <li>
                <Link href="/products?category=superfoods" className="text-neutral-400 hover:text-white transition">
                  Superfoods
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  My Account
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} NatureNutri. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <img src="https://cdn.cdnlogo.com/logos/v/69/visa.svg" alt="Visa" className="h-8 w-auto" />
              <img src="https://cdn.cdnlogo.com/logos/m/33/mastercard.svg" alt="Mastercard" className="h-8 w-auto" />
              <img src="https://cdn.cdnlogo.com/logos/p/20/paypal.svg" alt="PayPal" className="h-8 w-auto" />
              <img src="https://cdn.cdnlogo.com/logos/a/60/apple-pay.svg" alt="Apple Pay" className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
