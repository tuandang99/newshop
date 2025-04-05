
import { Helmet } from "react-helmet";

export default function RefundPolicy() {
  return (
    <>
      <Helmet>
        <title>Đổi Trả & Hoàn Tiền - TUHO Foods</title>
      </Helmet>
      
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Đổi Trả & Hoàn Tiền</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg">
            <h2>Điều Kiện Đổi Trả</h2>
            <ul>
              <li>Sản phẩm còn nguyên bao bì</li>
              <li>Trong thời hạn 7 ngày kể từ ngày nhận hàng</li>
              <li>Sản phẩm không đúng như mô tả hoặc bị lỗi</li>
            </ul>

            <h2>Quy Trình Hoàn Tiền</h2>
            <p>Sau khi nhận được hàng trả lại, chúng tôi sẽ kiểm tra và hoàn tiền trong vòng 3-5 ngày làm việc.</p>

            <h2>Phương Thức Hoàn Tiền</h2>
            <ul>
              <li>Chuyển khoản ngân hàng</li>
              <li>Ví điện tử (Momo, ZaloPay)</li>
              <li>Tiền mặt (đối với khách hàng tại HCM)</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
