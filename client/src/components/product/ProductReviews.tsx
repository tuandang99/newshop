
import { StarFilledIcon } from "@/lib/icons";

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductReviewsProps {
  reviews: Review[];
}

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Đánh giá từ khách hàng</h3>
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{review.userName}</span>
            <div className="flex">
              {Array.from({ length: review.rating }).map((_, i) => (
                <StarFilledIcon key={i} className="w-4 h-4 text-amber-500" />
              ))}
            </div>
            <span className="text-sm text-neutral-500">{review.date}</span>
          </div>
          <p className="text-neutral-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
