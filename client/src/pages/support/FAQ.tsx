
import { Helmet } from "react-helmet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <>
      <Helmet>
        <title>Câu Hỏi Thường Gặp - TUHO Foods</title>
      </Helmet>
      
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Câu Hỏi Thường Gặp</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>Làm sao để đặt hàng?</AccordionTrigger>
              <AccordionContent>
                Bạn có thể đặt hàng trực tiếp trên website hoặc qua số điện thoại hotline của chúng tôi. Chúng tôi sẽ xử lý đơn hàng trong vòng 24h.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Thời gian giao hàng mất bao lâu?</AccordionTrigger>
              <AccordionContent>
                Thời gian giao hàng từ 1-5 ngày tùy khu vực. Nội thành 1-2 ngày, ngoại thành và tỉnh thành khác 3-5 ngày.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Có được đổi trả hàng không?</AccordionTrigger>
              <AccordionContent>
                Có, bạn có thể đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi hoặc không đúng như mô tả.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}
