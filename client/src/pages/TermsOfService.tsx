import { Helmet } from "react-helmet";

export default function TermsOfService() {
  return (
    <>
      <Helmet>
        <title>Điều Khoản Dịch Vụ - TUHO Foods</title>
      </Helmet>
      
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Điều Khoản Dịch Vụ</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg">
            <h2>1. Giới thiệu</h2>
            <p>
              Chào mừng bạn đến với TUHO Healthy Food. Khi sử dụng website và dịch vụ của chúng tôi, 
              bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây. Vui lòng đọc kỹ 
              trước khi sử dụng dịch vụ.
            </p>

            <h2>2. Phạm vi áp dụng</h2>
            <p>Các điều khoản này áp dụng cho:</p>
            <ul>
              <li>Tất cả người dùng truy cập website tuhohealthyfood.com</li>
              <li>Khách hàng mua sản phẩm qua website hoặc các kênh liên kết</li>
              <li>Đối tác kinh doanh và nhà cung cấp có giao dịch với TUHO Healthy Food</li>
            </ul>

            <h2>3. Quy định về tài khoản</h2>
            <ul>
              <li>Người dùng có trách nhiệm bảo mật thông tin tài khoản của mình</li>
              <li>Không được chia sẻ tài khoản cho người khác sử dụng</li>
              <li>Thông báo ngay cho chúng tôi nếu phát hiện tài khoản bị sử dụng trái phép</li>
              <li>Chúng tôi có quyền khóa hoặc xóa tài khoản nếu phát hiện hành vi gian lận</li>
            </ul>

            <h2>4. Quy định về đặt hàng và thanh toán</h2>
            <p>Khi đặt hàng, quý khách cần:</p>
            <ul>
              <li>Cung cấp thông tin chính xác, đầy đủ về người nhận và địa chỉ giao hàng</li>
              <li>Xác nhận đơn hàng và phương thức thanh toán</li>
              <li>Thanh toán đầy đủ theo phương thức đã chọn</li>
              <li>Kiểm tra hàng hóa khi nhận và báo ngay nếu có vấn đề</li>
            </ul>

            <h2>5. Chính sách giao hàng</h2>
            <p>
              Thời gian giao hàng tùy thuộc vào địa điểm và sản phẩm đặt hàng. Chúng tôi sẽ cố gắng 
              giao hàng đúng thời gian cam kết, tuy nhiên có thể chậm trễ do các yếu tố khách quan 
              như thời tiết, giao thông, hoặc các sự kiện bất khả kháng.
            </p>

            <h2>6. Chính sách đổi trả và hoàn tiền</h2>
            <p>Vui lòng tham khảo Chính Sách Đổi Trả và Hoàn Tiền của chúng tôi để biết chi tiết.</p>
            <ul>
              <li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
              <li>Có hóa đơn hoặc chứng từ mua hàng</li>
              <li>Thời gian đổi trả theo quy định tại chính sách riêng</li>
            </ul>

            <h2>7. Trách nhiệm của khách hàng</h2>
            <p>Khách hàng cam kết:</p>
            <ul>
              <li>Sử dụng website và dịch vụ cho mục đích hợp pháp</li>
              <li>Không đăng tải nội dung vi phạm pháp luật, xúc phạm đến người khác</li>
              <li>Không sử dụng các công cụ tự động để truy cập website trái phép</li>
              <li>Tôn trọng quyền sở hữu trí tuệ của TUHO Healthy Food</li>
            </ul>

            <h2>8. Giới hạn trách nhiệm</h2>
            <p>TUHO Healthy Food không chịu trách nhiệm về:</p>
            <ul>
              <li>Thiệt hại gián tiếp phát sinh từ việc sử dụng sản phẩm</li>
              <li>Sự cố kỹ thuật, gián đoạn dịch vụ do lỗi hệ thống hoặc bên thứ ba</li>
              <li>Thông tin không chính xác do khách hàng cung cấp sai</li>
              <li>Các sự kiện bất khả kháng như thiên tai, chiến tranh, dịch bệnh</li>
            </ul>

            <h2>9. Quyền sở hữu trí tuệ</h2>
            <p>
              Tất cả nội dung trên website bao gồm văn bản, hình ảnh, logo, thiết kế đều thuộc 
              quyền sở hữu của CÔNG TY TNHH TUHO HEALTHY FOOD. Nghiêm cấm sao chép, phân phối 
              hoặc sử dụng cho mục đích thương mại mà không có sự cho phép.
            </p>

            <h2>10. Thay đổi điều khoản</h2>
            <p>
              Chúng tôi có quyền thay đổi, bổ sung các điều khoản này bất kỳ lúc nào. Các thay đổi 
              sẽ có hiệu lực ngay khi được đăng tải trên website. Việc tiếp tục sử dụng dịch vụ 
              sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
            </p>

            <h2>11. Thông tin liên hệ</h2>
            <p>Nếu có bất kỳ thắc mắc nào về Điều Khoản Dịch Vụ, vui lòng liên hệ:</p>
            <ul>
              <li>Tên doanh nghiệp: CÔNG TY TNHH TUHO HEALTHY FOOD</li>
              <li>Địa chỉ: Thôn Hải Hà, Xã Ea Tân, Huyện Krông Năng, Tỉnh Đắk Lắk, Việt Nam</li>
              <li>Email: tuhohealthyfood@gmail.com</li>
              <li>Hotline: 0398 377 304</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
