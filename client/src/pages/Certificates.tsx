
import { Helmet } from "react-helmet";
import { ShieldCheckIcon, AwardIcon } from "@/lib/icons";

export default function Certificates() {
  return (
    <>
      <Helmet>
        <title>Chứng Chỉ & Chứng Nhận - TUHO Foods</title>
        <meta
          name="description"
          content="Các chứng chỉ và chứng nhận chất lượng của TUHO Foods bao gồm HACCP, ISO 22000:2018 và các tiêu chuẩn an toàn thực phẩm khác."
        />
      </Helmet>

      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Chứng Chỉ & Chứng Nhận</h1>
          <p className="max-w-2xl mx-auto text-neutral-700">
            Cam kết chất lượng của chúng tôi được đảm bảo bởi các chứng nhận uy tín
            trong ngành thực phẩm
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* HACCP Certificate */}
            <div className="bg-white p-8 rounded-lg border border-neutral-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <ShieldCheckIcon className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-poppins mb-2">HACCP</h2>
                <p className="text-neutral-600">
                  Hệ thống phân tích mối nguy và điểm kiểm soát tới hạn
                </p>
              </div>
              
              <div className="certificate-image mb-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <img 
                    src="/images/certificate/haccp.jpg" 
                    alt="Chứng chỉ HACCP - TUHO Foods"
                    className="w-full h-auto object-contain max-h-[400px] mx-auto"
                  />
                </div>
              </div>
              
              <div className="text-sm text-neutral-600 space-y-2">
                <p><strong>Tên chứng chỉ:</strong> HACCP (Hazard Analysis Critical Control Points)</p>
                <p><strong>Mô tả:</strong> Hệ thống đảm bảo an toàn thực phẩm từ nguyên liệu đến thành phẩm</p>
                <p><strong>Phạm vi áp dụng:</strong> Toàn bộ quy trình sản xuất thực phẩm</p>
              </div>
            </div>

            {/* ISO 22000:2018 Certificate */}
            <div className="bg-white p-8 rounded-lg border border-neutral-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <ShieldCheckIcon className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-poppins mb-2">ISO 22000:2018</h2>
                <p className="text-neutral-600">
                  Tiêu chuẩn quốc tế về an toàn thực phẩm
                </p>
              </div>
              
              <div className="certificate-image mb-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <img 
                    src="/images/certificate/iso.jpg" 
                    alt="Chứng chỉ ISO 22000:2018 - TUHO Foods"
                    className="w-full h-auto object-contain max-h-[400px] mx-auto"
                  />
                </div>
              </div>
              
              <div className="text-sm text-neutral-600 space-y-2">
                <p><strong>Tên chứng chỉ:</strong> ISO 22000:2018</p>
                <p><strong>Mô tả:</strong> Hệ thống quản lý an toàn thực phẩm theo tiêu chuẩn quốc tế</p>
                <p><strong>Phạm vi áp dụng:</strong> Quản lý chất lượng và an toàn thực phẩm</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-primary/5 p-8 rounded-lg">
              <h3 className="text-2xl font-bold font-poppins mb-4 text-center">
                Cam Kết Chất Lượng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">HACCP - Kiểm Soát An Toàn</h4>
                  <p className="text-sm text-neutral-600">
                    Hệ thống HACCP giúp chúng tôi xác định và kiểm soát các mối nguy về an toàn thực phẩm 
                    tại mọi khâu trong quy trình sản xuất, đảm bảo sản phẩm đến tay người tiêu dùng 
                    luôn an toàn và chất lượng.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">ISO 22000:2018 - Tiêu Chuẩn Quốc Tế</h4>
                  <p className="text-sm text-neutral-600">
                    Chứng nhận ISO 22000:2018 khẳng định hệ thống quản lý an toàn thực phẩm của chúng tôi 
                    đáp ứng các tiêu chuẩn quốc tế nghiêm ngặt, mang lại sự tin tưởng cho khách hàng 
                    về chất lượng sản phẩm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
