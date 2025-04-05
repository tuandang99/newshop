
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost as BlogPostType } from "@shared/schema";
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
  
  const { data: recentPosts } = useQuery<BlogPostType[]>({
    queryKey: ['/api/recent-blog-posts'],
  });

  if (isLoading) {
    return (
      <section className="py-10 bg-white">
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
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold font-poppins mb-4">Không Tìm Thấy Bài Viết</h1>
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
      
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button asChild variant="outline" className="flex items-center">
              <Link href="/blog">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Quay Lại Blog
              </Link>
            </Button>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">{post.title}</h1>
              <div className="flex items-center text-sm text-neutral-500">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>{format(new Date(post.date), 'dd/MM/yyyy')}</span>
                <span className="mx-2">•</span>
                <span>{post.category}</span>
              </div>
            </div>
            
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-auto rounded-lg mb-8"
            />
            
            <div className="prose prose-lg max-w-none" data-color-mode="light">
              <MDEditor.Markdown source={post.content} />
            </div>
            
            <div className="border-t border-neutral-200 mt-10 pt-6">
              <h3 className="text-xl font-semibold mb-4 font-poppins">Bài Viết Liên Quan</h3>
              
              {recentPosts && recentPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentPosts
                    .filter(relatedPost => relatedPost.id !== post.id)
                    .slice(0, 2)
                    .map(relatedPost => (
                      <div key={relatedPost.id} className="bg-neutral-50 rounded-lg overflow-hidden">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          <img 
                            src={relatedPost.image} 
                            alt={relatedPost.title} 
                            className="w-full h-40 object-cover"
                          />
                        </Link>
                        <div className="p-4">
                          <h4 className="font-semibold mb-2 font-poppins line-clamp-1">
                            <Link href={`/blog/${relatedPost.slug}`} className="hover:text-primary transition">
                              {relatedPost.title}
                            </Link>
                          </h4>
                          <Link 
                            href={`/blog/${relatedPost.slug}`} 
                            className="text-primary font-medium hover:underline flex items-center text-sm"
                          >
                            Xem Bài Viết
                            <ArrowRightIcon className="ml-1 h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p>Không có bài viết liên quan</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
