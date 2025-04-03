import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CloseIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from "@/lib/icons";
import { useCart } from "@/context/CartContext";
import CheckoutModal from "./checkout-modal";

export default function CartDrawer() {
  const {
    isOpen,
    items,
    toggleCart,
    updateQuantity,
    removeItem,
    calculateTotal,
  } = useCart();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  useEffect(() => {
    // Add no-scroll class to body when cart is open
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const openCheckoutModal = () => {
    if (items.length === 0) return;
    toggleCart();
    setIsCheckoutModalOpen(true);
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };

  const subtotal = calculateTotal();

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-auto`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold font-poppins">Giỏ hàng</h2>
            <Button variant="ghost" size="icon" onClick={toggleCart}>
              <CloseIcon className="h-6 w-6" />
            </Button>
          </div>

          <div className="space-y-4 mb-6">
            {items.length === 0 ? (
              <div className="py-8 text-center">
                <ShoppingCartIcon className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">Giỏ hàng đang trống</p>
                <Button
                  variant="link"
                  onClick={toggleCart}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  Browse products
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center border-b border-neutral-200 pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-neutral-500 hover:text-primary"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <MinusIcon className="h-3 w-3" />
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-neutral-500 hover:text-primary"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <PlusIcon className="h-3 w-3" />
                      </Button>
                      <span className="ml-auto">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-neutral-400 hover:text-red-500"
                    onClick={() => removeItem(item.id)}
                  >
                    <CloseIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-neutral-200 pt-4 pb-6">
            <div className="flex justify-between mb-2">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Tiền ship</span>
              <span>Được tính khi gọi xác nhận</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Tổng cộng</span>
              <span>{subtotal.toLocaleString("vi-VN")}₫</span>
            </div>
            <Button
              className="w-full bg-primary text-white hover:bg-primary/90"
              onClick={openCheckoutModal}
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleCart}
        />
      )}

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={closeCheckoutModal}
      />
    </>
  );
}
