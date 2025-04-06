import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  ClockIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  PinterestIcon,
} from "@/lib/icons";
import { Helmet } from "react-helmet";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/contact", data);

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });

      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later or contact us directly by phone.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Liên Hệ - TUHO</title>
        <meta
          name="description"
          content="Liên hệ với TUHO Foods. Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn!"
        />
      </Helmet>

      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Liên Hệ</h1>
          <p className="max-w-2xl mx-auto text-neutral-700">
            Chúng tôi rất mong nhận được phản hồi từ bạn. Hãy liên hệ với chúng
            tôi nếu bạn có bất kỳ câu hỏi hoặc góp ý nào.
          </p>
        </div>
      </section>

      <section id="contact" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">
                            Họ và tên
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              {...field}
                              className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Tiêu đề</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Tin nhắn</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 px-8 py-3 text-base font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="md:w-1/2">
              <div className="bg-neutral-100 rounded-lg p-6 h-full">
                <h3 className="text-xl font-semibold mb-4 font-poppins">
                  Thông tin liên{" "}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <MapPinIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Địa Chỉ</h4>
                      <p className="text-neutral-700">
                        Thôn Hải Hà, Xã Ea Tân, Huyện Krông Năng, Tỉnh Đắk Lắk,
                        Việt Nam
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <MailIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-neutral-700">
                        tuhohealthyfood@gmail.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <PhoneIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Điện Thoại</h4>
                      <p className="text-neutral-700">0398 377 304</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <ClockIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Giờ Làm Việc</h4>
                      <p className="text-neutral-700">
                        Thứ Hai - Thứ Sáu: 8:00 - 17:00
                      </p>
                      <p className="text-neutral-700">
                        Thứ 7: 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-2">Liên hệ qua</h4>
                  <div className="flex space-x-2">
                    <a
                      href="#"
                      className="bg-primary/10 p-2 rounded-full hover:bg-primary/20 transition"
                    >
                      <FacebookIcon className="h-5 w-5 text-primary" />
                    </a>
                    <a
                      href="#"
                      className="bg-primary/10 p-2 rounded-full hover:bg-primary/20 transition"
                    >
                      <TwitterIcon className="h-5 w-5 text-primary" />
                    </a>
                    <a
                      href="#"
                      className="bg-primary/10 p-2 rounded-full hover:bg-primary/20 transition"
                    >
                      <InstagramIcon className="h-5 w-5 text-primary" />
                    </a>
                    <a
                      href="#"
                      className="bg-primary/10 p-2 rounded-full hover:bg-primary/20 transition"
                    >
                      <PinterestIcon className="h-5 w-5 text-primary" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d971.4429032724065!2d108.3286649696185!3d13.113649805332502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDA2JzQ5LjEiTiAxMDjCsDE5JzQ1LjUiRQ!5e0!3m2!1sen!2sus!4v1743696955779!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Location Map"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
