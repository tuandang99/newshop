import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import {
  LeafIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/lib/icons";
import { MapPin, MapPinIcon, PhoneIcon } from "lucide-react";

export default function Footer() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/logo.png"
                alt="TUHO Logo"
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'Chewy' }}>
                TUHO
              </span>
            </div>
            <p className="text-neutral-400 mb-4">
              Thực phẩm lành mạnh cao cấp cho lối sống lành mạnh hơn. Chúng tôi
              mang những điều tốt đẹp từ thiên nhiên đến tận bàn ăn của bạn.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/tuhohealthyfood/"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition"
              >
                <FacebookIcon className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://www.youtube.com/@TuhoHealthyFood"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition"
              >
                <YoutubeIcon className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://zalo.me/0393397304"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition"
              >
                <PhoneIcon className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://maps.app.goo.gl/Y4GSMPnHnPxWYGPm9"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition"
              >
                <MapPinIcon className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-neutral-400 hover:text-white transition"
                >
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-neutral-400 hover:text-white transition"
                >
                  Cửa Hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white transition"
                >
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                 <Link
                  href="/certificates"
                  className="text-neutral-400 hover:text-white transition"
                >
                  Chứng chỉ
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-neutral-400 hover:text-white transition"
                >
                  Tin Tức
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-400 hover:text-white transition"
                >
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">
              Danh Mục Sản Phẩm
            </h4>
            <ul className="space-y-2">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="text-neutral-400 hover:text-white transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">
              Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/support/shipping"
                  className="text-neutral-400 hover:text-white transition"
                >
                  Chính Sách Vận Chuyển
                </Link>
              </li>
              <li>
                <Link
                  href="/support/refund"
                  className="text-neutral-400 hover:text-white transition"
                >
                  Đổi Trả & Hoàn Tiền
                </Link>
              </li>
              <li>
                <Link
                  href="/support/faq"
                  className="text-neutral-400 hover:text-white transition"
                >
                  Câu Hỏi Thường Gặp
                </Link>
              </li>
              <li>
                <Link
                  href="/support/privacy"
                  className="text-neutral-400 hover:text-white transition"
                >
                  Chính Sách Bảo Mật
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-6">
          <div className="text-neutral-400 mb-6">
            <h4 className="font-semibold mb-2">
              CÔNG TY TNHH TUHO HEALTHY FOOD
            </h4>
            <p className="mb-1">MST: 6001773821</p>
            <p className="mb-1">
              Địa chỉ: Thôn Hải Hà, Xã Ea Tân, Huyện Krông Năng, Tỉnh Đắk Lắk,
              Việt Nam
            </p>
            <p className="mb-1">Email: tuhohealthyfood@gmail.com</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} TUHO Healthy Food. Đã đăng ký bản
              quyền.
            </p>
          </div>
            <a className="mt-4 block" href='http://online.gov.vn/Website/chi-tiet-131008'><img alt='' width={200} title='' src="images/hero/bct.png"/></a>
        </div>
      </div>
    </footer>
  );
}