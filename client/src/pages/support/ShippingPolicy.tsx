
import { Helmet } from "react-helmet";

export default function ShippingPolicy() {
  return (
    <>
      <Helmet>
        <title>Chính Sách Vận Chuyển - TUHO Foods</title>
      </Helmet>
      
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Chính Sách Vận Chuyển</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg">
            <h2>Phạm Vi Vận Chuyển</h2>
            <p>TUHO Foods thực hiện giao hàng trên toàn quốc thông qua các đối tác vận chuyển uy tín.</p>

            <h2>Thời Gian Giao Hàng</h2>
            <ul>
              <li>Nội thành: 1-2 ngày làm việc</li>
              <li>Ngoại thành: 2-3 ngày làm việc</li>
              <li>Tỉnh thành khác: 3-5 ngày làm việc</li>
            </ul>

            <h2>Phí Vận Chuyển</h2>
            <p>Phí vận chuyển được tính dựa trên khoảng cách và trọng lượng đơn hàng. Miễn phí vận chuyển cho đơn hàng từ 500.000đ.</p>

            <h2>Chính Sách Đổi Trả</h2>
            <p>Quý khách có thể yêu cầu đổi/trả hàng trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi hoặc không đúng như mô tả.</p>
          </div>
        </div>
      </section>
    </>
  );
}
