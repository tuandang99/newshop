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
      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold font-poppins mb-2">
                Bài viết mới nhất
              </h2>
              <p className="text-neutral-700">
                Chia sẻ về mẹo và các kiến thức
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
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
      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-poppins mb-2">
            Bài viết mới nhất
          </h2>
          <p className="text-red-500">
            Failed to load blog posts. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold font-poppins mb-2">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <Link href={`/blog/${post.slug}`}>
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-6">
                <div className="flex items-center text-sm text-neutral-500 mb-3">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{format(new Date(post.date), "MMMM d, yyyy")}</span>
                  <span className="mx-2">•</span>
                  <span>{post.category}</span>
                </div>
                <h3 className="font-semibold text-xl mb-2 font-poppins">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary transition"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-neutral-700 mb-4">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary font-medium hover:underline flex items-center"
                >
                  Read More
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
