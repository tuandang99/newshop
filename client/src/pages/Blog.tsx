
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BlogPost, BlogPostsResponse } from "@shared/schema";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowRightIcon } from "@/lib/icons";
import { format } from "date-fns";
import { Helmet } from "react-helmet";

export default function Blog() {
  const {
    data: postsResponse,
    isLoading,
    error,
  } = useQuery<BlogPostsResponse>({
    queryKey: ["/api/blog-posts"],
  });

  const posts = postsResponse?.posts;
  const [groupedPosts, setGroupedPosts] = useState<Record<string, BlogPost[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (posts) {
      const newGrouped: Record<string, BlogPost[]> = {};
      const filteredPosts = selectedCategory 
        ? posts.filter(post => post.category === selectedCategory)
        : posts;
        
      filteredPosts.forEach((post) => {
        const date = new Date(post.date);
        const yearMonth = format(date, "MMMM yyyy");
        if (!newGrouped[yearMonth]) {
          newGrouped[yearMonth] = [];
        }
        newGrouped[yearMonth].push(post);
      });
      setGroupedPosts(newGrouped);
    }
  }, [posts, selectedCategory]);

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold font-poppins mb-2">Blog của chúng tôi</h1>
            <p className="text-neutral-700">
              Kiến thức, công thức và lời khuyên cho cuộc sống lành mạnh
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
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
      <section className="py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold font-poppins mb-2">Blog của chúng tôi</h1>
          <p className="text-red-500">
            Không thể tải bài viết. Vui lòng thử lại sau.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog - TUHO Healthy Food</title>
        <meta
          name="description"
          content="Đọc các bài viết mới nhất về dinh dưỡng, công thức nấu ăn lành mạnh và lối sống bền vững."
        />
      </Helmet>

      <section className="py-8 sm:py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold font-poppins mb-4">Blog của chúng tôi</h1>
          <p className="max-w-2xl mx-auto text-neutral-700">
            Kiến thức, lời khuyên và công thức giúp bạn sống một cuộc sống khỏe mạnh,
            bền vững hơn.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Blog Categories - Mobile View */}
            <div className="lg:hidden mb-6">
              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 font-poppins">
                  Danh mục
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    className="text-sm py-1 px-3 h-auto"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Tất cả
                  </Button>
                  {posts && Array.from(new Set(posts.map(post => post.category))).map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="text-sm py-1 px-3 h-auto"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Blog Content */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              {Object.keys(groupedPosts).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-700">Không có bài viết nào trong danh mục này.</p>
                </div>
              ) : (
                Object.keys(groupedPosts).map((yearMonth) => (
                  <div key={yearMonth} className="mb-10">
                    <h2 className="text-xl sm:text-2xl font-semibold font-poppins mb-4 sm:mb-6 border-b border-neutral-200 pb-2">
                      {yearMonth}
                    </h2>
                    <div className="space-y-6 sm:space-y-8">
                      {groupedPosts[yearMonth].map((post) => (
                        <div
                          key={post.id}
                          className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                        >
                          <div className="sm:w-1/3">
                            <Link href={`/blog/${post.slug}`}>
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-48 object-cover rounded-lg"
                                loading="lazy"
                              />
                            </Link>
                          </div>
                          <div className="sm:w-2/3">
                            <div className="flex items-center text-xs sm:text-sm text-neutral-500 mb-2">
                              <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              <span>
                                {format(new Date(post.date), "dd MMMM, yyyy")}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{post.category}</span>
                            </div>
                            <h3 className="font-semibold text-lg sm:text-xl mb-2 font-poppins">
                              <Link
                                href={`/blog/${post.slug}`}
                                className="hover:text-primary transition"
                              >
                                {post.title}
                              </Link>
                            </h3>
                            <p className="text-neutral-700 mb-4 text-sm sm:text-base">
                              {post.excerpt}
                            </p>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-primary font-medium hover:underline flex items-center text-sm sm:text-base"
                            >
                              Đọc thêm
                              <ArrowRightIcon className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sidebar - Desktop View */}
            <div className="hidden lg:block order-1 lg:order-2">
              <div className="bg-neutral-50 p-6 rounded-lg sticky top-24">
                <h3 className="text-xl font-semibold mb-4 font-poppins">
                  Danh mục
                </h3>
                <ul className="space-y-2">
                  {posts && Array.from(new Set(posts.map(post => post.category))).map(category => (
                    <li key={category}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:text-primary hover:bg-primary/10"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    </li>
                  ))}
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:text-primary hover:bg-primary/10"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Tất cả
                    </Button>
                  </li>
                </ul>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 font-poppins">
                    Đăng ký
                  </h3>
                  <p className="text-neutral-700 mb-4">
                    Cập nhật bài viết mới nhất và lời khuyên dinh dưỡng.
                  </p>
                  <form className="space-y-2">
                    <input
                      type="email"
                      placeholder="Địa chỉ email của bạn"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      type="submit"
                      className="w-full bg-primary text-white hover:bg-primary/90"
                    >
                      Đăng ký
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
