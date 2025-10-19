import { Helmet } from "react-helmet";

export default function DataRemoval() {
  return (
    <>
      <Helmet>
        <title>Chính Sách Xóa Dữ Liệu - TUHO Foods</title>
      </Helmet>
      
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Chính Sách Xóa Dữ Liệu</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg">
            <h2>1. Quyền xóa dữ liệu cá nhân</h2>
            <p>
              Tại TUHO Healthy Food, chúng tôi tôn trọng quyền riêng tư của khách hàng. Bạn có 
              quyền yêu cầu xóa toàn bộ hoặc một phần thông tin cá nhân mà chúng tôi đang lưu trữ.
            </p>

            <h2>2. Dữ liệu có thể được xóa</h2>
            <p>Bạn có thể yêu cầu xóa các loại dữ liệu sau:</p>
            <ul>
              <li>Thông tin tài khoản (tên, email, số điện thoại)</li>
              <li>Địa chỉ giao hàng đã lưu</li>
              <li>Lịch sử đơn hàng (nếu không còn tranh chấp)</li>
              <li>Thông tin thanh toán đã lưu</li>
              <li>Dữ liệu cookies và theo dõi</li>
              <li>Đăng ký nhận email marketing</li>
            </ul>

            <h2>3. Dữ liệu không thể xóa ngay lập tức</h2>
            <p>Một số dữ liệu có thể được giữ lại trong các trường hợp sau:</p>
            <ul>
              <li>Đơn hàng đang trong quá trình xử lý hoặc giao hàng</li>
              <li>Các giao dịch đang có tranh chấp hoặc khiếu nại</li>
              <li>Thông tin cần thiết để tuân thủ pháp luật (hóa đơn, thuế)</li>
              <li>Dữ liệu cần thiết cho mục đích kế toán (thường 5-10 năm theo quy định)</li>
              <li>Thông tin liên quan đến các vụ kiện pháp lý đang diễn ra</li>
            </ul>

            <h2>4. Cách thức yêu cầu xóa dữ liệu</h2>
            <p>Để yêu cầu xóa dữ liệu cá nhân, vui lòng làm theo các bước sau:</p>
            
            <h3>Bước 1: Gửi yêu cầu</h3>
            <p>Liên hệ với chúng tôi qua một trong các kênh sau:</p>
            <ul>
              <li>Email: tuhohealthyfood@gmail.com (với tiêu đề: "Yêu cầu xóa dữ liệu cá nhân")</li>
              <li>Hotline: 0398 377 304</li>
              <li>Địa chỉ: Thôn Hải Hà, Xã Ea Tân, Huyện Krông Năng, Tỉnh Đắk Lắk, Việt Nam</li>
            </ul>

            <h3>Bước 2: Cung cấp thông tin xác minh</h3>
            <p>Để đảm bảo an toàn, bạn cần cung cấp:</p>
            <ul>
              <li>Họ và tên đầy đủ</li>
              <li>Số điện thoại hoặc email đã đăng ký</li>
              <li>Thông tin chi tiết về dữ liệu cần xóa</li>
              <li>Lý do xóa dữ liệu (tùy chọn)</li>
            </ul>

            <h3>Bước 3: Xác nhận danh tính</h3>
            <p>
              Chúng tôi có thể yêu cầu bạn xác nhận danh tính thông qua OTP, email xác nhận hoặc 
              các phương thức khác để đảm bảo yêu cầu xóa dữ liệu đến từ chính chủ tài khoản.
            </p>

            <h2>5. Thời gian xử lý</h2>
            <ul>
              <li><strong>Xác nhận tiếp nhận:</strong> Trong vòng 24 giờ làm việc</li>
              <li><strong>Xử lý yêu cầu:</strong> Từ 7-30 ngày làm việc tùy theo độ phức tạp</li>
              <li><strong>Thông báo hoàn tất:</strong> Gửi email xác nhận sau khi xóa dữ liệu thành công</li>
            </ul>

            <h2>6. Quy trình xóa dữ liệu</h2>
            <p>Sau khi xác minh thông tin, chúng tôi sẽ:</p>
            <ol>
              <li>Xóa dữ liệu khỏi cơ sở dữ liệu chính</li>
              <li>Xóa dữ liệu khỏi các bản sao lưu (trong vòng 90 ngày)</li>
              <li>Thông báo cho các đối tác liên quan (nếu có)</li>
              <li>Gửi xác nhận hoàn tất cho khách hàng</li>
            </ol>

            <h2>7. Hậu quả khi xóa dữ liệu</h2>
            <p>Khi dữ liệu bị xóa, bạn sẽ:</p>
            <ul>
              <li>Không thể đăng nhập vào tài khoản (nếu xóa tài khoản)</li>
              <li>Mất lịch sử đơn hàng và thông tin mua sắm</li>
              <li>Không nhận được thông tin khuyến mãi và hỗ trợ khách hàng</li>
              <li>Cần đăng ký lại nếu muốn sử dụng dịch vụ trong tương lai</li>
            </ul>

            <h2>8. Quyền khiếu nại</h2>
            <p>
              Nếu bạn không hài lòng với cách chúng tôi xử lý yêu cầu xóa dữ liệu, bạn có quyền 
              khiếu nại tới cơ quan bảo vệ dữ liệu cá nhân có thẩm quyền.
            </p>

            <h2>9. Liên hệ</h2>
            <p>Để biết thêm thông tin hoặc gửi yêu cầu xóa dữ liệu, vui lòng liên hệ:</p>
            <ul>
              <li>Tên doanh nghiệp: CÔNG TY TNHH TUHO HEALTHY FOOD</li>
              <li>Mã số thuế: 6001773821</li>
              <li>Địa chỉ: Thôn Hải Hà, Xã Ea Tân, Huyện Krông Năng, Tỉnh Đắk Lắk, Việt Nam</li>
              <li>Email: tuhohealthyfood@gmail.com</li>
              <li>Hotline: 0398 377 304</li>
            </ul>

            <p className="mt-8 text-sm text-gray-600">
              <em>Chính sách này có hiệu lực từ ngày đăng tải và có thể được cập nhật theo thời gian.</em>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
