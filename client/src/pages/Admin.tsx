import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import MDEditor from '@uiw/react-md-editor';
import '@/components/ui/markdown-styles.css';

// Product form schema
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  oldPrice: z.coerce.number().nullable().optional(),
  image: z.string().url("Must be a valid URL"),
  categoryId: z.coerce.number().min(1, "Category is required"),
  rating: z.coerce.number().min(0).max(5).optional(),
  isNew: z.boolean().optional(),
  isOrganic: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Blog post form schema
const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  image: z.string().url("Must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  date: z.string().transform(val => new Date(val).toISOString()),
  tags: z.string().optional(),
  author: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featured: z.boolean().optional().default(false),
  status: z.enum(["published", "draft", "archived"]).default("published"),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

// Admin key authentication schema
const authSchema = z.object({
  adminKey: z.string().min(6, "Admin key must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

// Schema for changing the admin key
const changeKeySchema = z.object({
  newKey: z.string().min(6, "New admin key must be at least 6 characters"),
});

type ChangeKeyFormValues = z.infer<typeof changeKeySchema>;


export default function Admin() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if admin is authenticated on page load
  useEffect(() => {
    const storedKey = localStorage.getItem("adminKey");
    if (storedKey) {
      setAdminKey(storedKey);
      validateAdminKey(storedKey);
    }
  }, []);

  // Auth form
  const authForm = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      adminKey: "",
    }
  });

  //Change Key Form
  const changeKeyForm = useForm<ChangeKeyFormValues>({
    resolver: zodResolver(changeKeySchema),
    defaultValues: {
      newKey: "",
    }
  });

  // Product form
  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      oldPrice: null,
      image: "",
      categoryId: 0,
      rating: 5,
      isNew: false,
      isOrganic: true,
      isBestseller: false,
    }
  });

  // Blog form
  const blogForm = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      tags: "",
      author: "",
      metaTitle: "",
      metaDescription: "",
      featured: false,
      status: "published",
    }
  });

  // Categories query
  const { data: categories = [] } = useQuery<any[]>({ 
    queryKey: ['/api/categories'],
    enabled: authenticated
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // Use fetch directly to include the admin-key header
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Key': adminKey
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Added",
        description: "Product has been added successfully",
      });
      productForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/featured-products'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add product",
        variant: "destructive"
      });
    }
  });

  // Add blog post mutation
  const addBlogMutation = useMutation({
    mutationFn: async (data: BlogFormValues) => {
      // Use fetch directly to include the admin-key header
      const response = await fetch('/api/admin/blog-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Key': adminKey
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add blog post');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog Post Added",
        description: "Blog post has been added successfully",
      });
      blogForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recent-blog-posts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add blog post",
        variant: "destructive"
      });
    }
  });

  // Verify admin key against the backend
  const validateAdminKey = async (key: string) => {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Key': key
        }
      });

      if (response.ok) {
        setAuthenticated(true);
        localStorage.setItem("adminKey", key);
        setAdminKey(key);
        return true;
      } else {
        localStorage.removeItem("adminKey");
        setAuthenticated(false);
        toast({
          title: "Authentication Failed",
          description: "Invalid admin key",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify admin key",
        variant: "destructive"
      });
      return false;
    }
  };

  //Handle change key mutation
  const changeKeyMutation = useMutation({
    mutationFn: async (data: ChangeKeyFormValues) => {
      const response = await fetch('/api/admin/changeKey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Key': adminKey
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change admin key');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Admin Key Changed',
        description: 'Your admin key has been successfully updated.',
      });
      changeKeyForm.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to change admin key',
        variant: 'destructive',
      });
    },
  });


  // Handle admin login
  const handleLogin = async (values: AuthFormValues) => {
    const success = await validateAdminKey(values.adminKey);
    if (success) {
      toast({
        title: "Authenticated",
        description: "You are now logged in as admin"
      });
    }
  };

  // Handle change key submission
  const handleChangeKey = (values: ChangeKeyFormValues) => {
    changeKeyMutation.mutate(values);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminKey");
    setAuthenticated(false);
    setAdminKey("");
    toast({
      title: "Logged Out",
      description: "You have been logged out"
    });
    setLocation("/");
  };

  // Handle product form submission
  const onSubmitProduct = (data: ProductFormValues) => {
    addProductMutation.mutate(data);
  };

  // Handle blog form submission
  const onSubmitBlog = (data: BlogFormValues) => {
    addBlogMutation.mutate(data);
  };

  // Generate slug from name/title
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  if (!authenticated) {
    return (
      <>
        <Helmet>
          <title>Admin Login - NatureNutri</title>
        </Helmet>
        <div className="container py-16 max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Enter your admin key to access the admin panel</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...authForm}>
                <form onSubmit={authForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={authForm.control}
                    name="adminKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Key</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your admin key" 
                            type="password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={authForm.formState.isSubmitting}
                  >
                    {authForm.formState.isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - NatureNutri</title>
      </Helmet>
      <div className="container py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Change Admin Key</CardTitle>
            <CardDescription>Update your admin access key</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...changeKeyForm}>
              <form onSubmit={changeKeyForm.handleSubmit(handleChangeKey)} className="space-y-4">
                <FormField
                  control={changeKeyForm.control}
                  name="newKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Admin Key</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter new admin key"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={changeKeyForm.formState.isSubmitting || changeKeyMutation.isPending}
                >
                  {changeKeyForm.formState.isSubmitting || changeKeyMutation.isPending ? "Updating..." : "Update Key"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>
                  Create a new product that will appear in the store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...productForm}>
                  <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={productForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Product name" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (!productForm.getValues("slug")) {
                                    productForm.setValue("slug", generateSlug(e.target.value));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={productForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input placeholder="product-slug" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={productForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Product description" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={productForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                placeholder="9.99" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={productForm.control}
                        name="oldPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Old Price ($) (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                placeholder="12.99" 
                                {...field} 
                                value={field.value === null ? '' : field.value}
                                onChange={(e) => {
                                  const value = e.target.value === '' ? null : parseFloat(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={productForm.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <select 
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                                value={field.value}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              >
                                <option value="">Select Category</option>
                                {categories?.map((category: any) => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={productForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={productForm.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating (0-5)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1" 
                              min="0" 
                              max="5" 
                              placeholder="4.5" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={productForm.control}
                        name="isNew"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>New Product</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={productForm.control}
                        name="isOrganic"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Organic Product</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={productForm.control}
                        name="isBestseller"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Bestseller</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={addProductMutation.isPending}
                    >
                      {addProductMutation.isPending ? "Adding..." : "Add Product"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Posts Tab */}
          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <CardTitle>Add New Blog Post</CardTitle>
                <CardDescription>
                  Create a new blog post to share with your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...blogForm}>
                  <form onSubmit={blogForm.handleSubmit(onSubmitBlog)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={blogForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Blog post title" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (!blogForm.getValues("slug")) {
                                    blogForm.setValue("slug", generateSlug(e.target.value));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={blogForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input placeholder="blog-post-slug" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={blogForm.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief summary of the blog post" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={blogForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content (Markdown supported)</FormLabel>
                          <FormControl>
                            <div data-color-mode="light" className="w-full">
                              <MDEditor
                                value={field.value}
                                onChange={(value) => field.onChange(value || '')}
                                height={400}
                                preview="edit"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={blogForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Nutrition, Recipes" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={blogForm.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={blogForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={blogForm.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                              <Input placeholder="Author name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={blogForm.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags (comma separated)</FormLabel>
                            <FormControl>
                              <Input placeholder="organic,nutrition,tips" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={blogForm.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Title (SEO)</FormLabel>
                            <FormControl>
                              <Input placeholder="Meta title for SEO" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={blogForm.control}
                        name="metaDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Description (SEO)</FormLabel>
                            <FormControl>
                              <Input placeholder="Meta description for SEO" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={blogForm.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Featured Post</FormLabel>
                              <p className="text-sm text-muted-foreground">Feature this post on the homepage</p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={blogForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <select 
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                              >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={addBlogMutation.isPending}
                    >
                      {addBlogMutation.isPending ? "Adding..." : "Add Blog Post"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}