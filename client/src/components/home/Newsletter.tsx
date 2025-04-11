import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email bắt buộc",
        description: "Vui lòng nhập địa chỉ email",
        variant: "destructive",
      });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Email không hợp lệ",
        description: "Vui lòng nhập một địa chỉ email hợp lệ",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Send to server
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      toast({
        title: "Đăng ký thành công!",
        description: "Cảm ơn bạn đã đăng ký nhận tin.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-poppins mb-4">Đăng Ký Nhận Tin</h2>
          <p className="text-neutral-700 mb-6">
            Đăng ký để nhận thông tin cập nhật, ưu đãi độc quyền và nhiều hơn nữa.
          </p>
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary flex-grow"
            />
            <Button 
              type="submit" 
              className="bg-primary text-white hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang đăng ký..." : "Đăng Ký"}
            </Button>
          </form>
          <p className="text-sm text-neutral-500 mt-4">
            Khi đăng ký, bạn đồng ý với Chính sách Bảo mật và đồng ý nhận thông tin cập nhật từ công ty chúng tôi.
          </p>
        </div>
      </div>
    </section>
  );
}