import { LeafIcon, BringToFrontIcon, AwardIcon } from "@/lib/icons";

export default function Features() {
  const features = [
    {
      icon: <LeafIcon className="text-3xl text-primary" />,
      title: "100% Tự Nhiên",
      description: "Sản phẩm từ nguyên liệu tự nhiên, không chất bảo quản, đảm bảo dinh dưỡng tốt nhất cho sức khỏe."
    },
    {
      icon: <BringToFrontIcon className="text-3xl text-primary" />,
      title: "Đa Dạng Sản Phẩm",
      description: "Granola, thanh gạo lứt, bánh kẹp rong biển, ngũ cốc và các loại hạt dinh dưỡng tự nhiên."
    },
    {
      icon: <AwardIcon className="text-3xl text-primary" />,
      title: "Chất Lượng Cao",
      description: "Cam kết cung cấp thực phẩm healthy chất lượng cao, đảm bảo an toàn vệ sinh thực phẩm."
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">{feature.title}</h3>
              <p className="text-neutral-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
