import { Helmet } from "react-helmet";
import { LeafIcon, HeartIcon, SproutIcon, ShieldCheckIcon } from "@/lib/icons";
import Certifications from "@/components/home/Certifications";

export default function About() {
  return (
    <>
      <Helmet>
        <title>Về chúng tôi - TUHO Foods</title>
        <meta
          name="description"
          content="Công ty TUHO cung cấp các thực phẩm tốt cho sức khỏe, hướng đến chất lượng cao và cam kết vì sự bền vững."
        />
      </Helmet>

      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Về chúng tôi</h1>
          <p className="max-w-2xl mx-auto text-neutral-700">
            Câu chuyện, sứ mệnh và cam kết của chúng tôi trong việc cung cấp cho
            bạn những thực phẩm tốt cho sức khỏe chất lượng cao nhất.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img
                src="https://i.pinimg.com/736x/54/63/f8/5463f879dafecd317b771aaee0d4a0aa.jpg"
                alt="TUHO founders"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold font-poppins mb-4">
                Câu Chuyện Của Chúng Tôi
              </h2>
              <p className="mb-4 text-neutral-700">
                Tuho Healthy Food được thành lập từ niềm đam mê với thực phẩm
                dinh dưỡng và một tầm nhìn về sức khỏe bền vững. Chúng tôi tin
                rằng sức khỏe là tài sản quý giá nhất và nó bắt đầu từ những gì
                bạn ăn mỗi ngày. Chính vì vậy, ngoài các loại hạt dinh dưỡng,
                Tuho còn mang đến những sản phẩm sáng tạo như granola, thanh
                rong biển kẹp hạt, thanh gạo lứt – những lựa chọn tuyệt vời giúp
                bạn duy trì một lối sống khỏe mạnh và tràn đầy năng lượng.
              </p>
              <p className="mb-4 text-neutral-700">
                Chúng tôi chỉ chọn lọc nguyên liệu từ các vùng trồng đạt chuẩn,
                cam kết không chất bảo quản, không phụ gia nhân tạo, để giữ trọn
                vẹn hương vị tự nhiên và giá trị dinh dưỡng. Mỗi sản phẩm đều
                được chế biến với sự tận tâm, nhằm mang đến cho bạn những lựa
                chọn ngon miệng, lành mạnh mỗi ngày.
              </p>
              <p className="text-neutral-700">
                Tuho Healthy Food không chỉ là một thương hiệu thực phẩm, mà là
                một phong trào lan tỏa lối sống lành mạnh, nơi mỗi bữa ăn không
                chỉ đơn giản là bổ sung dinh dưỡng, mà còn là một niềm vui, một
                cách để tận hưởng cuộc sống trọn vẹn hơn.
              </p>
              <p className="mt-4 font-semibold text-primary text-lg">
                Tuho Healthy Food – Hạt giống dinh dưỡng cho cuộc sống khỏe mạnh
                và tràn đầy năng lượng!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="values" className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-poppins mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="max-w-2xl mx-auto text-neutral-700">
              Những nguyên tắc cốt lõi này định hướng mọi hoạt động của TUHO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LeafIcon className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">
                Chất Lượng
              </h3>
              <p className="text-neutral-700">
                Chúng tôi chỉ sử dụng nguyên liệu hữu cơ chất lượng cao nhất,
                đảm bảo mọi sản phẩm đều đáp ứng các tiêu chuẩn nghiêm ngặt.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">
                Sức Khỏe
              </h3>
              <p className="text-neutral-700">
                Chúng tôi tin vào sức mạnh của thực phẩm bổ dưỡng để cải thiện
                cuộc sống và hỗ trợ sức khỏe.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SproutIcon className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">
                Bền Vững
              </h3>
              <p className="text-neutral-700">
                Chúng tôi cam kết thực hiện canh tác bền vững và sử dụng giải
                pháp đóng gói thân thiện với môi trường.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">
                Minh Bạch
              </h3>
              <p className="text-neutral-700">
                Chúng tôi tin vào giao tiếp trung thực và công khai về nguyên
                liệu và quy trình sản xuất.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12">
              <img
                src="https://i.pinimg.com/736x/74/6d/cb/746dcb5636244b7d78722cf67640b203.jpg"
                alt="Sustainable farming"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pr-12">
              <h2 className="text-3xl font-bold font-poppins mb-4">
                Cam Kết Về Sự Bền Vững Và Chất Lượng
              </h2>
              <p className="mb-4 text-neutral-700">
                Tại TUHO, chúng tôi cam kết mang đến những sản phẩm chất lượng
                cao cấp với giá thành hợp lý, giúp người tiêu dùng dễ dàng tiếp
                cận thực phẩm sạch và an toàn. Chúng tôi lựa chọn nguyên liệu từ
                những nguồn đáng tin cậy, đảm bảo quy trình sản xuất đạt tiêu
                chuẩn nghiêm ngặt theo ISO, HACCP và các chứng nhận quốc tế
                khác.
              </p>
              <p className="mb-4 text-neutral-700">
                Mọi sản phẩm của TUHO đều trải qua quá trình kiểm định khắt khe,
                đáp ứng các tiêu chí an toàn thực phẩm và giữ trọn vẹn giá trị
                dinh dưỡng. Chúng tôi không ngừng nghiên cứu, cải tiến công nghệ
                sản xuất để mang đến những sản phẩm tốt nhất, vừa bảo vệ sức
                khỏe người tiêu dùng vừa thân thiện với môi trường.
              </p>
              <p className="text-neutral-700">
                Với triết lý kinh doanh minh bạch và trách nhiệm, TUHO không chỉ
                đảm bảo chất lượng mà còn tối ưu hóa giá thành, giúp người tiêu
                dùng có cơ hội sử dụng sản phẩm cao cấp mà không phải trả mức
                giá quá cao. Sự hài lòng của khách hàng chính là động lực để
                chúng tôi tiếp tục phát triển và nâng cao tiêu chuẩn trong ngành
                thực phẩm.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Certifications />

      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-poppins mb-4">HEALTHY FOOD</h2>
          <p className="max-w-2xl mx-auto mb-8 text-neutral-700">
            Sức khỏe là nền tảng cho một cuộc sống trọn vẹn. Khi chọn TUHO, bạn
            đang lựa chọn những sản phẩm an toàn, bổ dưỡng và tự nhiên, giúp cơ
            thể khỏe mạnh và tràn đầy năng lượng mỗi ngày.
          </p>
          <p className="font-semibold text-primary text-lg">
            Cảm ơn bạn đã đồng hành cùng chúng tôi hướng tới một hành tinh khỏe
            mạnh hơn.
          </p>
        </div>
      </section>
    </>
  );
}
