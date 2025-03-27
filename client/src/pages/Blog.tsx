import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowRightIcon } from "@/lib/icons";
import { format } from "date-fns";
import { Helmet } from "react-helmet";

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

export default function Blog() {
  const { data: postsResponse, isLoading, error } = useQuery<BlogPostsResponse>({
    queryKey: ['/api/blog-posts'],
  });
  
  // Extract posts from the response
  const posts = postsResponse?.posts;

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-poppins mb-2">Our Blog</h1>
            <p className="text-neutral-700">Insights, recipes, and tips for healthy living</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-2">Our Blog</h1>
          <p className="text-red-500">Failed to load blog posts. Please try again later.</p>
        </div>
      </section>
    );
  }

  // Group posts by year and month
  const groupedPosts: Record<string, BlogPost[]> = {};
  
  posts.forEach(post => {
    const date = new Date(post.date);
    const yearMonth = format(date, 'MMMM yyyy');
    
    if (!groupedPosts[yearMonth]) {
      groupedPosts[yearMonth] = [];
    }
    
    groupedPosts[yearMonth].push(post);
  });

  return (
    <>
      <Helmet>
        <title>Blog - NatureNutri</title>
        <meta name="description" content="Read our latest articles on nutrition, healthy recipes, and sustainable living." />
      </Helmet>
      
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-poppins mb-4">Our Blog</h1>
          <p className="max-w-2xl mx-auto text-neutral-700">
            Insights, tips, and recipes to help you live a healthier, more sustainable life.
          </p>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {Object.keys(groupedPosts).map(yearMonth => (
                <div key={yearMonth} className="mb-10">
                  <h2 className="text-2xl font-semibold font-poppins mb-6 border-b border-neutral-200 pb-2">
                    {yearMonth}
                  </h2>
                  <div className="space-y-8">
                    {groupedPosts[yearMonth].map(post => (
                      <div key={post.id} className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <Link href={`/blog/${post.slug}`}>
                            <img 
                              src={post.image} 
                              alt={post.title} 
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </Link>
                        </div>
                        <div className="md:w-2/3">
                          <div className="flex items-center text-sm text-neutral-500 mb-2">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
                            <span className="mx-2">•</span>
                            <span>{post.category}</span>
                          </div>
                          <h3 className="font-semibold text-xl mb-2 font-poppins">
                            <Link href={`/blog/${post.slug}`} className="hover:text-primary transition">
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
              ))}
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-neutral-50 p-6 rounded-lg sticky top-24">
                <h3 className="text-xl font-semibold mb-4 font-poppins">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <Button variant="ghost" className="w-full justify-start hover:text-primary hover:bg-primary/10">Nutrition</Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start hover:text-primary hover:bg-primary/10">Recipes</Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start hover:text-primary hover:bg-primary/10">Sustainability</Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start hover:text-primary hover:bg-primary/10">Wellness</Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start hover:text-primary hover:bg-primary/10">Lifestyle</Button>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 font-poppins">Subscribe</h3>
                  <p className="text-neutral-700 mb-4">Stay updated with our latest articles and nutritional tips.</p>
                  <form className="space-y-2">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90">
                      Subscribe
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
