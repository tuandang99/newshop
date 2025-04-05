
import { Helmet } from "react-helmet";

export default function ShippingPolicy() {
  return (
    <>
      <Helmet>
        <title>Chính Sách Vận Chuyển - TUHO Foods</title>
      </Helmet>
      
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Chính Sách Vận Chuyển và Kiểm Tra Hàng</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg">
            <h2>1. Phạm vi áp dụng</h2>
            <p>Chính sách vận chuyển áp dụng cho tất cả các đơn hàng trên phạm vi 63 tỉnh thành trong cả nước.</p>

            <h2>2. Thời gian giao – nhận hàng</h2>
            <p>Sau khi đơn hàng được xác nhận và xử lý, sản phẩm sẽ được giao trong vòng 48 giờ, hoặc theo tiến độ đã thống nhất trong hợp đồng (nếu có).</p>
            <p>Đối với khách hàng ở tỉnh xa, thời gian dự kiến nhận hàng từ 3–5 ngày làm việc, tùy thuộc vào địa điểm, điều kiện thời tiết và tình trạng vận chuyển.</p>
            <p>Thời gian giao hàng được tính từ lúc hoàn tất xác nhận đơn hàng với nhân viên tư vấn đến khi khách hàng nhận được hàng.</p>

            <h2>3. Hình thức giao hàng</h2>
            <ul>
              <li>Khách hàng ở nội thành hoặc ngoại thành: sử dụng dịch vụ giao hàng tận nơi của bên thứ ba.</li>
              <li>Khách hàng ở tỉnh xa: sử dụng các dịch vụ chuyển phát nhanh, đơn vị vận chuyển chuyên nghiệp.</li>
            </ul>

            <h3>Trách nhiệm của đơn vị vận chuyển (logistics):</h3>
            <p>Đơn vị giao nhận hàng hóa có trách nhiệm cung cấp đầy đủ chứng từ giao hàng (bao gồm ảnh chụp kiện hàng và chữ ký người nhận) cho cả bên mua và bên bán khi có yêu cầu.</p>

            <h2>4. Chính sách kiểm tra hàng hóa</h2>
            <p>Quý khách có quyền yêu cầu được kiểm tra sản phẩm trước khi nhận, tuy nhiên không được thử hàng.</p>
            <p>Trường hợp sản phẩm giao không đúng loại, mẫu mã, số lượng như đơn đặt hàng, quý khách có quyền từ chối nhận hàng và không thanh toán.</p>
            <p>Nếu quý khách đã thanh toán trước nhưng đơn hàng bị sai, chúng tôi cam kết sẽ hoàn tiền 100% hoặc đổi lại đúng sản phẩm như đã đặt.</p>

            <h2>Thông tin liên hệ</h2>
            <p>Mọi yêu cầu liên quan đến việc hoàn tiền, đổi hàng vui lòng liên hệ:</p>
            <ul>
              <li>Email: tuhohealthyfood@gmail.com</li>
              <li>Hotline: 0398 377 304</li>
            </ul>
            <p>Chúng tôi cam kết sẽ tiếp nhận và giải quyết nhanh chóng, thỏa đáng mọi yêu cầu từ quý khách.</p>
          </div>
        </div>
      </section>
    </>
  );
}
