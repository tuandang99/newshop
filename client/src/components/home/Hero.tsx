import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-primary/10 py-10 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-bold font-poppins mb-4 leading-tight text-neutral-900">
              Tuho - Hạt Dinh Dưỡng & Bánh Từ Hạt Dinh Dưỡng Chất Lượng Cao
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold font-poppins mb-4 leading-tight text-neutral-900">
              Thực phẩm tự nhiên cho <span className="text-primary">Cuộc sống khỏe mạnh</span>
            </h2>
            <p className="text-lg mb-8 text-neutral-700">
              Khám phá bộ sưu tập thực phẩm dinh dưỡng cao cấp của chúng tôi, nuôi dưỡng cơ thể và tinh thần của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-primary text-white hover:bg-primary/90">
                <Link href="/products">Mua Ngay</Link>
              </Button>
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Link href="/about">Tìm Hiểu Thêm</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="images/hero/hero.jpg" 
              alt="Healthy food assortment" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
