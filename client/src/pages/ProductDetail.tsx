import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, Category, ProductImage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { StarFilledIcon, Plus, Minus, ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "@/lib/icons";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import ProductCard from "@/components/product/ProductCard";
import ProductGallery from "@/components/product/ProductGallery";

export default function ProductDetail() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { addItem } = useCart();
  const { toast } = useToast();

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
  });

  const {
    data: productImages,
    isLoading: imagesLoading,
  } = useQuery<ProductImage[]>({
    queryKey: [`/api/products/${product?.id}/images`],
    enabled: !!product?.id, // Only fetch when product is loaded
  });

  const { data: productsResponse } = useQuery({
    queryKey: ['/api/products'],
    enabled: !!product, // Only fetch when product data is available
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const categoryName =
    product && categories
      ? categories.find((cat) => cat.id === product.categoryId)?.name
      : null;

  const increaseQuantity = () => setQuantity((q) => q + 1);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      });

      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart`,
      });
    }
  };

  if (productLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold font-poppins mb-4">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-neutral-700 mb-6">
            Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa.
          </p>
          <Button asChild>
            <Link href="/products">Quay lại mục sản phẩm</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} - TUHO Healthy FoodFood</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button asChild variant="outline" className="flex items-center">
              <Link href="/products">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              {imagesLoading ? (
                <div className="bg-gray-100 animate-pulse rounded-lg w-full aspect-square"></div>
              ) : (
                <ProductGallery 
                  productImages={productImages || []}
                  fallbackImage={product.image}
                />
              )}
            </div>

            <div className="md:w-1/2">
              <div className="mb-2">
                {categoryName && (
                  <Link
                    href={`/products?category=${categories?.find((cat) => cat.id === product.categoryId)?.slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {categoryName}
                  </Link>
                )}
              </div>

              <h1 className="text-3xl font-bold font-poppins mb-2">
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center mr-2">
                  <StarFilledIcon className="text-amber-500 h-5 w-5" />
                  <span className="ml-1 font-medium">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                {product.isOrganic && (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    Organic
                  </span>
                )}
              </div>

              <div className="mb-6">
                <p className="text-neutral-700">{product.description}</p>
              </div>

              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold mr-2">
                  {product.price.toLocaleString("vi-VN")}₫
                </span>
                {product.oldPrice && (
                  <span className="text-neutral-500 line-through">
                    {product.oldPrice.toLocaleString("vi-VN")}₫
                  </span>
                )}
              </div>

              <div className="flex items-center mb-6">
                <div className="flex items-center border border-neutral-300 rounded-md mr-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={increaseQuantity}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="bg-primary text-white hover:bg-primary/90 px-8"
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <h3 className="font-semibold mb-2">Chi tiết sản phẩm</h3>
                <ul className="list-disc list-inside text-neutral-700 space-y-1">
                  {product.details && product.details.length > 0 ? (
                    product.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))
                  ) : (
                    <li>Chưa có thông tin chi tiết</li>
                  )}
                </ul>
              </div>

              {/* Related Products */}
              <div className="border-t border-neutral-200 pt-6 mt-6">
                <h3 className="text-lg font-bold mb-4">Sản phẩm liên quan</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {productsResponse?.products
                    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
                    .slice(0, 3)
                    .map(relatedProduct => (
                      <ProductCard key={relatedProduct.id} product={relatedProduct} variant="compact" />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}