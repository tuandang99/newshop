
import { Helmet } from "react-helmet";

export default function RefundPolicy() {
  return (
    <>
      <Helmet>
        <title>Đổi Trả & Hoàn Tiền - TUHO Foods</title>
      </Helmet>
      
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Chính Sách Đổi Trả</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg">
            <h2>1. Điều kiện đổi/trả hàng</h2>
            <p>Quý khách vui lòng kiểm tra kỹ sản phẩm ngay khi nhận hàng. Việc đổi/trả hàng được áp dụng trong các trường hợp sau:</p>
            <ul>
              <li>Sản phẩm giao không đúng chủng loại, mẫu mã như đã đặt trong đơn hàng hoặc không giống mô tả trên website tại thời điểm đặt hàng.</li>
              <li>Sản phẩm bị thiếu số lượng, thiếu linh kiện, phụ kiện đi kèm như đã cam kết.</li>
              <li>Hàng hóa có dấu hiệu hư hỏng do quá trình vận chuyển như: rách bao bì, bong tróc, trầy xước, nứt vỡ,...</li>
            </ul>

            <p>Khi yêu cầu đổi/trả, Quý khách cần cung cấp các bằng chứng, tài liệu liên quan (hóa đơn, hình ảnh sản phẩm,...) để chứng minh tình trạng hàng hóa không đạt yêu cầu.</p>

            <h2>2. Thời gian và cách thức đổi/trả hàng</h2>
            <ul>
              <li><strong>Thời hạn thông báo đổi/trả:</strong> Trong vòng 48 giờ kể từ thời điểm nhận hàng, áp dụng với các trường hợp thiếu phụ kiện, quà tặng kèm hoặc sản phẩm bị hư hỏng.</li>
              <li><strong>Thời hạn gửi hàng đổi/trả:</strong> Trong vòng 14 ngày kể từ ngày nhận sản phẩm.</li>
              <li><strong>Địa điểm đổi/trả:</strong> Quý khách có thể trực tiếp mang sản phẩm đến văn phòng/cửa hàng của chúng tôi hoặc gửi qua đường bưu điện về địa chỉ được cung cấp.</li>
            </ul>

            <p>Nếu Quý khách có bất kỳ phản hồi hay khiếu nại nào liên quan đến chất lượng sản phẩm, xin vui lòng liên hệ với bộ phận chăm sóc khách hàng của chúng tôi để được tiếp nhận và xử lý kịp thời.</p>
          </div>
        </div>
      </section>
    </>
  );
}
