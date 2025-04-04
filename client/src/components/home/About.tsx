import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <section id="about" className="py-8 sm:py-12 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center gap-6 md:gap-8">
          <div className="w-full md:w-1/2 mt-6 sm:mt-8 md:mt-0 md:pr-8">
            <h2 className="text-3xl font-bold font-poppins mb-4">Lời ngỏ</h2>
            <p className="mb-4 text-neutral-700">
              Tại Tuho Healthy Food, chúng tôi tin rằng sức khỏe bắt đầu từ thực
              phẩm tự nhiên và chất lượng. Vì vậy, chúng tôi chọn lọc nguyên
              liệu từ các vùng trồng đạt chuẩn, cam kết không chất bảo quản,
              không phụ gia nhân tạo, giữ trọn hương vị và giá trị dinh dưỡng.
            </p>
            <p className="mb-6 text-neutral-700">
              Mỗi sản phẩm, từ hạt macca, granola đến thanh rong biển kẹp hạt,
              đều được tạo ra với tâm huyết. Chúng tôi mong muốn mang đến cho
              bạn những lựa chọn lành mạnh, giúp ăn ngon, sống khỏe và tận hưởng
              cuộc sống trọn vẹn hơn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Link href="/about">Về chúng tôi</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Link href="/about#values">Giá trị màng </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1607301405345-41e34312ba95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
              alt="Organic farm"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
