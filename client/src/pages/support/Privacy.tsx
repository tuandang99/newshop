
import { Helmet } from "react-helmet";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Chính Sách Bảo Mật - TUHO Foods</title>
      </Helmet>
      
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Chính Sách Bảo Mật Thông Tin Khách Hàng</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg">
            <h2>1. Mục đích thu thập thông tin cá nhân</h2>
            <p>Chúng tôi thu thập thông tin cá nhân của khách hàng nhằm các mục đích sau:</p>
            <ul>
              <li>Hỗ trợ khách hàng trong quá trình mua hàng, thanh toán và giao nhận.</li>
              <li>Cung cấp thông tin về sản phẩm, dịch vụ theo yêu cầu.</li>
              <li>Gửi các thông báo, chương trình khuyến mãi, sản phẩm mới hoặc thông tin có liên quan.</li>
              <li>Giải quyết các vấn đề phát sinh trong quá trình giao dịch, mua bán sản phẩm.</li>
            </ul>

            <h2>2. Phạm vi thu thập thông tin</h2>
            <p>Thông tin được thu thập bao gồm:</p>
            <ul>
              <li>Họ và tên: CÔNG TY TNHH TUHO HEALTHY FOOD</li>
              <li>Email: tuhohealthyfood@gmail.com</li>
              <li>Số điện thoại: 0398 377 304</li>
              <li>Địa chỉ: Thôn Hải Hà, Xã Ea Tân, Huyện Krông Năng, Tỉnh Đắk Lắk, Việt Nam</li>
            </ul>

            <h2>3. Thời gian lưu trữ thông tin</h2>
            <p>Thông tin cá nhân của khách hàng sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc khách hàng tự đăng nhập để thực hiện hủy. Trong mọi trường hợp khác, dữ liệu vẫn sẽ được bảo mật và lưu trữ an toàn trên hệ thống của chúng tôi.</p>

            <h2>4. Các bên có thể tiếp cận thông tin cá nhân</h2>
            <p>Thông tin cá nhân của khách hàng có thể được chia sẻ với các bên sau:</p>
            <ul>
              <li>Đơn vị vận chuyển: phục vụ cho việc giao nhận hàng hóa.</li>
              <li>Nhân viên công ty: phục vụ cho hoạt động hỗ trợ, chăm sóc khách hàng.</li>
              <li>Đối tác liên kết/thuê ngoài: nhằm thực hiện các dịch vụ liên quan như đã nêu ở Mục 1, với cam kết bảo mật.</li>
              <li>Cơ quan pháp luật: trong trường hợp có yêu cầu theo quy định.</li>
              <li>Trường hợp chuyển giao kinh doanh: bên tiếp nhận sẽ có quyền truy cập vào thông tin đã lưu trữ, bao gồm cả dữ liệu cá nhân.</li>
            </ul>

            <h2>5. Đơn vị thu thập và quản lý thông tin</h2>
            <ul>
              <li>Tên doanh nghiệp: CÔNG TY TNHH TUHO HEALTHY FOOD</li>
              <li>Mã số thuế: 6001773821</li>
              <li>Địa chỉ: Thôn Hải Hà, Xã Ea Tân, Huyện Krông Năng, Tỉnh Đắk Lắk, Việt Nam</li>
              <li>Email liên hệ: tuhohealthyfood@gmail.com</li>
              <li>Hotline: 0398 377 304</li>
            </ul>

            <h2>6. Phương thức tiếp cận và chỉnh sửa thông tin cá nhân</h2>
            <p>Quý khách có thể yêu cầu kiểm tra, chỉnh sửa hoặc xóa bỏ thông tin cá nhân đã cung cấp qua:</p>
            <ul>
              <li>Điện thoại: 0398 377 304</li>
              <li>Email: tuhohealthyfood@gmail.com</li>
            </ul>

            <h2>7. Giải quyết khiếu nại liên quan đến thông tin cá nhân</h2>
            <p>Chúng tôi cam kết:</p>
            <ul>
              <li>Không chia sẻ, mua bán, hay cho thuê thông tin cá nhân của khách hàng với bất kỳ bên thứ ba nào nếu không có sự đồng ý từ khách hàng.</li>
              <li>Thông tin chỉ được sử dụng phục vụ cho các mục đích chính đáng như nâng cao dịch vụ, giải quyết khiếu nại và theo yêu cầu của cơ quan chức năng.</li>
            </ul>

            <p>Nếu có bất kỳ phản hồi hoặc khiếu nại nào liên quan đến việc thông tin cá nhân bị sử dụng sai mục đích, vui lòng liên hệ:</p>
            <ul>
              <li>Hotline: 0398 377 304</li>
              <li>Email: tuhohealthyfood@gmail.com</li>
            </ul>
            <p>Chúng tôi sẽ tiếp nhận, xử lý và phản hồi trong thời gian sớm nhất.</p>
          </div>
        </div>
      </section>
    </>
  );
}
