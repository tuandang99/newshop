import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardIcon, ProductsIcon, OrdersIcon, BlogIcon } from "@/lib/icons";

export default function AdminDashboard() {
  const { data: products = [] } = useQuery({ 
    queryKey: ['/api/products'], 
  });
  
  const { data: categories = [] } = useQuery({ 
    queryKey: ['/api/categories'], 
  });
  
  const { data: blogPosts = [] } = useQuery({ 
    queryKey: ['/api/blog-posts'], 
  });

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      description: "All active products",
      icon: <ProductsIcon className="h-5 w-5 text-muted-foreground" />,
      color: "bg-blue-100"
    },
    {
      title: "Categories",
      value: categories.length,
      description: "Product categories",
      icon: <ProductsIcon className="h-5 w-5 text-muted-foreground" />,
      color: "bg-green-100"
    },
    {
      title: "Recent Orders",
      value: "15", // Placeholder since we don't have a specific order API
      description: "Last 30 days",
      icon: <OrdersIcon className="h-5 w-5 text-muted-foreground" />,
      color: "bg-yellow-100"
    },
    {
      title: "Blog Posts",
      value: blogPosts.length,
      description: "Published posts",
      icon: <BlogIcon className="h-5 w-5 text-muted-foreground" />,
      color: "bg-purple-100"
    }
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard | NatureNutri Admin</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your store performance and content
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>
                Latest products added to your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {products.slice(0, 5).map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                          <ProductsIcon className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.inStock ? (
                        <span className="text-green-500">In Stock</span>
                      ) : (
                        <span className="text-red-500">Out of Stock</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Blog Posts</CardTitle>
              <CardDescription>
                Latest content published on your blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {blogPosts.slice(0, 5).map((post: any) => (
                  <div key={post.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      {post.imageUrl ? (
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                          <BlogIcon className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}