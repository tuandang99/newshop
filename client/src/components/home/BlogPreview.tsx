import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CalendarIcon } from "@/lib/icons";
import { format } from "date-fns";

// Define the API response structure
interface BlogPostsResponse {
  posts: BlogPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function BlogPreview() {
  const {
    data: postsResponse,
    isLoading,
    error,
  } = useQuery<BlogPostsResponse>({
    queryKey: ["/api/recent-blog-posts"],
  });

  // Extract posts from the response
  const posts = postsResponse?.posts;

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-poppins mb-2">
                Bài viết mới nhất
              </h2>
              <p className="text-neutral-700">
                Chia sẻ về mẹo và các kiến thức
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-sm p-4 animate-pulse h-full"
              >
                <div className="w-full h-36 sm:h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !posts) {
    return (
      <section className="py-8 sm:py-12 bg-neutral-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-poppins mb-2">
            Bài viết mới nhất
          </h2>
          <p className="text-red-500">
            Không thể tải bài viết. Vui lòng thử lại sau.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-poppins mb-2">
              Bài viết mới nhất
            </h2>
            <p className="text-neutral-700">
              Chia sẻ về mẹo và các kiến thức
            </p>
          </div>
          <Link
            href="/blog"
            className="mt-4 md:mt-0 text-primary font-medium hover:underline"
          >
            Xem tất cả bài viết
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  width={400}
                  height={200}
                  className="w-full h-36 sm:h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
              </Link>
              <div className="p-4 sm:p-6 flex-grow flex flex-col">
                <div className="flex flex-wrap items-center text-xs sm:text-sm text-neutral-500 mb-2 sm:mb-3">
                  <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{format(new Date(post.date), "d MMMM, yyyy")}</span>
                  <span className="mx-2">•</span>
                  <span>{post.category}</span>
                </div>
                <h3 className="font-semibold text-lg sm:text-xl mb-2 line-clamp-2 flex-grow">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary transition"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-neutral-700 mb-4 text-sm sm:text-base line-clamp-2">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary font-medium hover:underline flex items-center text-sm sm:text-base mt-auto"
                >
                  Đọc thêm
                  <ArrowRightIcon className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
