import { Helmet } from "react-helmet";
import { LeafIcon, HeartIcon, SproutIcon, ShieldCheckIcon } from "@/lib/icons";

export default function About() {
  return (
    <>
      <Helmet>
        <title>Về chúng tôi - TUHO Foods</title>
        <meta name="description" content="Công ty TUHO cung cấp các thực phẩm tốt cho sức khỏe, hướng đến chất lượng cao và cam kết vì sự bền vững." />
      </Helmet>
      
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Về chúng tôi</h1>
          <p className="max-w-2xl mx-auto text-neutral-700">
            Câu chuyện, sứ mệnh và cam kết của chúng tôi trong việc cung cấp cho bạn những thực phẩm tốt cho sức khỏe chất lượng cao nhất.
          </p>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img 
                src="https://images.unsplash.com/photo-1607301405345-41e34312ba95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="TUHO founders" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold font-poppins mb-4">Câu Chuyện Của Chúng Tôi</h2>
              <p className="mb-4 text-neutral-700">
                TUHO được thành lập vào năm 2015 bởi một nhóm những người đam mê sức khỏe với niềm đam mê chung về thực phẩm hữu cơ bổ dưỡng.
                Hành trình của chúng tôi bắt đầu với một niềm tin đơn giản: thực phẩm lành mạnh phải ngon miệng, dễ tiếp cận và bền vững.
              </p>
              <p className="mb-4 text-neutral-700">
                Sau nhiều năm tìm kiếm thực phẩm hữu cơ chất lượng cao mà không phải đánh đổi hương vị, chúng tôi quyết định tạo ra
                dòng sản phẩm riêng đáp ứng các tiêu chuẩn nghiêm ngặt về dinh dưỡng, hương vị và trách nhiệm môi trường.
              </p>
              <p className="text-neutral-700">
                Ngày nay, TUHO đã phát triển thành một thương hiệu uy tín cung cấp đa dạng các loại hạt hữu cơ, thanh granola, ngũ cốc
                và thực phẩm bổ dưỡng. Chúng tôi tiếp tục đổi mới và mở rộng dòng sản phẩm, luôn trung thành với các nguyên tắc sáng lập.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section id="values" className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-poppins mb-4">Giá Trị Cốt Lõi</h2>
            <p className="max-w-2xl mx-auto text-neutral-700">
              Những nguyên tắc cốt lõi này định hướng mọi hoạt động của TUHO.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LeafIcon className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">Chất Lượng</h3>
              <p className="text-neutral-700">
                Chúng tôi chỉ sử dụng nguyên liệu hữu cơ chất lượng cao nhất, đảm bảo mọi sản phẩm đều đáp ứng các tiêu chuẩn nghiêm ngặt.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">Sức Khỏe</h3>
              <p className="text-neutral-700">
                Chúng tôi tin vào sức mạnh của thực phẩm bổ dưỡng để cải thiện cuộc sống và hỗ trợ sức khỏe.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SproutIcon className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">Bền Vững</h3>
              <p className="text-neutral-700">
                Chúng tôi cam kết thực hiện canh tác bền vững và sử dụng giải pháp đóng gói thân thiện với môi trường.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">Minh Bạch</h3>
              <p className="text-neutral-700">
                Chúng tôi tin vào giao tiếp trung thực và công khai về nguyên liệu và quy trình sản xuất.
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
                src="https://images.unsplash.com/photo-1595356700395-6f14b5ea4fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Sustainable farming" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pr-12">
              <h2 className="text-3xl font-bold font-poppins mb-4">Cam Kết Về Tính Bền Vững</h2>
              <p className="mb-4 text-neutral-700">
                Tại TUHO, tính bền vững là cốt lõi trong hoạt động kinh doanh của chúng tôi. Chúng tôi làm việc trực tiếp với 
                nông dân thực hành nông nghiệp tái tạo, giúp phục hồi sức khỏe đất và đa dạng sinh học.
              </p>
              <p className="mb-4 text-neutral-700">
                Bao bì của chúng tôi được thiết kế để giảm thiểu tác động môi trường. Chúng tôi sử dụng vật liệu có thể tái chế 
                khi có thể và liên tục nghiên cứu các giải pháp sáng tạo để giảm thiểu rác thải.
              </p>
              <p className="text-neutral-700">
                Chúng tôi cũng bù đắp dấu chân carbon bằng cách đầu tư vào các dự án tái trồng rừng và sáng kiến năng lượng tái tạo.
                Đối với chúng tôi, có trách nhiệm với môi trường không chỉ là kinh doanh tốt - đó là việc đúng đắn cần làm.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-poppins mb-4">Tham Gia Cùng Chúng Tôi</h2>
          <p className="max-w-2xl mx-auto mb-8 text-neutral-700">
            Mỗi khi bạn chọn TUHO, bạn không chỉ lựa chọn sức khỏe cho bản thân—mà còn đang ủng hộ
            canh tác bền vững và bảo vệ môi trường.
          </p>
          <p className="font-semibold text-primary text-lg">
            Cảm ơn bạn đã đồng hành cùng chúng tôi hướng tới một hành tinh khỏe mạnh hơn.
          </p>
        </div>
      </section>
    </>
  );
}
