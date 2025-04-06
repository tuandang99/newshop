import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(5, "Số điện thoại là bắt buộc"),
  address: z.string().min(5, "Địa chỉ là bắt buộc"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, calculateTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (items.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        description: "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        ...data,
        items: JSON.stringify(items),
        total: calculateTotal(),
      };

      await apiRequest("POST", "/api/orders", orderData);

      toast({
        title: "Đặt hàng thành công!",
        description: "Chúng tôi sẽ gửi email xác nhận cho bạn trong thời gian sớm nhất.",
      });

      clearCart();
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Đặt hàng thất bại",
        description: "Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold font-poppins">
            Hoàn tất đơn hàng
          </DialogTitle>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button> */}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập số điện thoại của bạn"
                      {...field}
                      type="tel"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ giao hàng</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập địa chỉ giao hàng của bạn"
                      {...field}
                      rows={3}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
