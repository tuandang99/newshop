
import { Helmet } from "react-helmet";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Chính Sách Bảo Mật - TUHO Foods</title>
      </Helmet>
      
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Chính Sách Bảo Mật</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg">
            <h2>Thu Thập Thông Tin</h2>
            <p>Chúng tôi chỉ thu thập những thông tin cần thiết để xử lý đơn hàng và cải thiện dịch vụ khách hàng.</p>

            <h2>Bảo Mật Thông Tin</h2>
            <p>Mọi thông tin cá nhân của khách hàng được mã hóa và bảo mật theo tiêu chuẩn ngành.</p>

            <h2>Chia Sẻ Thông Tin</h2>
            <p>Chúng tôi không chia sẻ thông tin khách hàng cho bên thứ ba, trừ khi được yêu cầu bởi pháp luật.</p>
          </div>
        </div>
      </section>
    </>
  );
}
