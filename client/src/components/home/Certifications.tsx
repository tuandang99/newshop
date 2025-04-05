
import { ShieldCheckIcon } from "@/lib/icons";

export default function Certifications() {
  const certifications = [
    {
      name: "ISO 22000:2018",
      description: "Tiêu chuẩn quốc tế về an toàn thực phẩm",
      icon: <ShieldCheckIcon className="h-12 w-12 text-primary" />,
    },
    {
      name: "HACCP",
      description: "Hệ thống phân tích mối nguy và điểm kiểm soát tới hạn",
      icon: <ShieldCheckIcon className="h-12 w-12 text-primary" />,
    },
    {
      name: "Công bố sản phẩm",
      description: "Công bố sản phẩm",
      icon: <ShieldCheckIcon className="h-12 w-12 text-primary" />,
    },
    {
      name: "Kiểm nghiệm sản phẩm",
      description: "Thực hiện đầy đủ nghiểm nghiệm chất lượng sản ",
      icon: <ShieldCheckIcon className="h-12 w-12 text-primary" />,
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-poppins mb-4">Chứng Nhận & Chứng Chỉ</h2>
          <p className="text-neutral-700 max-w-2xl mx-auto">
            Cam kết chất lượng của chúng tôi được đảm bảo bởi các chứng nhận uy tín
            trong ngành thực phẩm
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{cert.icon}</div>
                <h3 className="text-xl font-semibold mb-2 font-poppins">{cert.name}</h3>
                <p className="text-neutral-600">{cert.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
