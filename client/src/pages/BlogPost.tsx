import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost as BlogPostType, BlogPostsResponse } from "@shared/schema"; 
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowLeftIcon, ArrowRightIcon } from "@/lib/icons";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
import MDEditor from '@uiw/react-md-editor';
import '@/components/ui/markdown-styles.css';

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery<BlogPostType>({
    queryKey: [`/api/blog-posts/${slug}`],
  });

  // Get related posts from the same category
  const { data: relatedPosts } = useQuery<BlogPostsResponse>({
    queryKey: ['/api/blog-posts'],
    enabled: !!post // Only fetch when the main post is loaded
  });

  const filteredRelatedPosts = relatedPosts?.posts?.filter(
    p => p.id !== post?.id && p.category === post?.category
  )?.slice(0, 3);


  if (isLoading) {
    return (
      <section className="py-6 sm:py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="py-6 sm:py-10 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl sm:text-2xl font-bold font-poppins mb-4">Không Tìm Thấy Bài Viết</h1>
          <p className="text-neutral-700 mb-6">
            Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button asChild>
            <Link href="/blog">Quay Lại Blog</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - Blog TUHO</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <section className="py-6 sm:py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button asChild variant="outline" className="flex items-center text-sm">
              <Link href="/blog">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Quay Lại Blog
              </Link>
            </Button>
          </div>

          <article className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-poppins mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center text-sm text-neutral-500">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>{format(new Date(post.date), 'dd/MM/yyyy')}</span>
                <span className="mx-2">•</span>
                <span>{post.category}</span>
              </div>
            </div>

            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto rounded-lg mb-8 max-h-[500px] object-cover"
              loading="lazy"
            />

            <div className="prose max-w-none sm:prose-lg md:prose-xl break-words" data-color-mode="light">
              <MDEditor.Markdown source={post.content} />
            </div>


            {/* Related Posts */}
            {filteredRelatedPosts && filteredRelatedPosts.length > 0 && (
              <div className="mt-8 sm:mt-12 border-t border-neutral-200 pt-8">
                <h3 className="text-xl sm:text-2xl font-semibold mb-6">Bài viết liên quan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {filteredRelatedPosts.map((relatedPost) => (
                    <div key={relatedPost.id} className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
                      <Link href={`/blog/${relatedPost.slug}`} className="block">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-40 sm:h-48 object-cover"
                          loading="lazy"
                        />
                      </Link>
                      <div className="p-4 flex-grow flex flex-col">
                        <div className="flex items-center text-sm text-neutral-500 mb-2">
                          <span className="text-xs">{format(new Date(relatedPost.date), 'dd/MM/yyyy')}</span>
                        </div>
                        <h4 className="font-semibold line-clamp-2 mb-2 flex-grow">
                          <Link href={`/blog/${relatedPost.slug}`} className="hover:text-primary">
                            {relatedPost.title}
                          </Link>
                        </h4>
                        <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                          {relatedPost.excerpt}
                        </p>
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="text-primary text-sm font-medium hover:underline inline-flex items-center mt-auto"
                        >
                          Đọc thêm
                          <ArrowRightIcon className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
