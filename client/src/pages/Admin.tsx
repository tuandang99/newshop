import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Category form schema
const categoryFormSchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
  slug: z.string().min(1, "Slug là bắt buộc"),
  image: z.string()
    .min(1, "Đường dẫn ảnh là bắt buộc")
    .refine(
      (val) => val.startsWith("/") || val.startsWith("http"),
      "Đường dẫn ảnh phải bắt đầu bằng '/' cho file local hoặc 'http' cho URL"
    ),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import MDEditor from "@uiw/react-md-editor";
import "@/components/ui/markdown-styles.css";

// Product form schema
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  oldPrice: z.coerce.number().nullable().optional(),
  image: z.string()
    .min(1, "Image path is required")
    .refine(
      (val) => val.startsWith("/") || val.startsWith("http"),
      "Image path must start with '/' for local files or 'http' for URLs"
    ),
  categoryId: z.coerce.number().min(1, "Category is required"),
  rating: z.coerce.number().min(0).max(5).optional(),
  isNew: z.boolean().optional(),
  isOrganic: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  details: z
    .array(z.string())
    .default([])
    .or(
      z.string().transform((str) =>
        str
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s && s !== "-"),
      ),
    ),
  newImage: z.string().optional(), // Added for new image upload
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Blog post form schema
const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  image: z.string()
    .min(1, "Image path is required")
    .refine(
      (val) => val.startsWith("/") || val.startsWith("http"),
      "Image path must start with '/' for local files or 'http' for URLs"
    ),
  category: z.string().min(1, "Category is required"),
  date: z.string().transform((val) => new Date(val).toISOString()),
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
    },
  });

  //Change Key Form
  const changeKeyForm = useForm<ChangeKeyFormValues>({
    resolver: zodResolver(changeKeySchema),
    defaultValues: {
      newKey: "",
    },
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
      details: [],
      newImage: "", // Added for new image upload
    },
  });

  // Blog form
  // Category form
  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      image: "",
    },
  });

  const blogForm = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      tags: "",
      author: "",
      meta_title: "",
      meta_description: "",
      featured: false,
      status: "published",
    },
  });

  // Categories query
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
    enabled: authenticated,
  });

  const { data: productsResponse } = useQuery<ProductsResponse>({
    queryKey: ["/api/products"],
    enabled: authenticated,
  });

  const products = productsResponse?.products || [];

  const { data: blogPostsResponse } = useQuery<BlogPostsResponse>({
    queryKey: ["/api/blog-posts"],
    enabled: authenticated,
  });

  const blogPosts = blogPostsResponse?.posts || [];

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);

  // Query for product images when editing
  const { data: productImages = [] } = useQuery<ProductImage[]>({
    queryKey: [`/api/products/${editingProduct?.id}/images`],
    enabled: !!editingProduct,
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (data: Product) => {
      const response = await fetch(`/api/admin/products/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Admin-Key": adminKey,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully",
      });
      setEditingProduct(null);
      productForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    },
  });

  // Update blog post mutation
  const updateBlogMutation = useMutation({
    mutationFn: async (data: BlogPost) => {
      const response = await fetch(`/api/admin/blog-posts/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Admin-Key": adminKey,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update blog post");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog Post Updated",
        description: "Blog post has been updated successfully",
      });
      setEditingBlogPost(null);
      blogForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // Use fetch directly to include the admin-key header
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Admin-Key": adminKey,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Added",
        description: "Product has been added successfully",
      });
      productForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/featured-products"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    },
  });

  // Add blog post mutation
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          "Admin-Key": adminKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      return true;
    },
    onSuccess: () => {
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  // Delete blog post mutation
  const deleteBlogMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/blog-posts/${id}`, {
        method: "DELETE",
        headers: {
          "Admin-Key": adminKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete blog post");
      }

      return true;
    },
    onSuccess: () => {
      toast({
        title: "Blog Post Deleted",
        description: "Blog post has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleDeleteBlogPost = (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteBlogMutation.mutate(id);
    }
  };

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Admin-Key": adminKey,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add category");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thêm danh mục thành công",
        description: "Danh mục mới đã được thêm vào hệ thống",
      });
      categoryForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm danh mục",
        variant: "destructive",
      });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Admin-Key": adminKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      return true;
    },
    onSuccess: () => {
      toast({
        title: "Xóa danh mục thành công",
        description: "Danh mục đã được xóa khỏi hệ thống",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa danh mục",
        variant: "destructive",
      });
    },
  });

  const handleDeleteCategory = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  // Handle category form submission
  const onSubmitCategory = (data: CategoryFormValues) => {
    addCategoryMutation.mutate(data);
  };

  const addBlogMutation = useMutation({
    mutationFn: async (data: BlogFormValues) => {
      // Use fetch directly to include the admin-key header
      const response = await fetch("/api/admin/blog-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Admin-Key": adminKey,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add blog post");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog Post Added",
        description: "Blog post has been added successfully",
      });
      blogForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recent-blog-posts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add blog post",
        variant: "destructive",
      });
    },
  });

  // Verify admin key against the backend
  const validateAdminKey = async (key: string | undefined) => {
    if (!key) return false;
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Admin-Key": key,
        },
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
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify admin key",
        variant: "destructive",
      });
      return false;
    }
  };

  //Handle change key mutation
  const changeKeyMutation = useMutation({
    mutationFn: async (data: ChangeKeyFormValues) => {
      if (!data?.newKey) {
        throw new Error("New key is required");
      }
      const response = await fetch("/api/admin/key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Admin-Key": adminKey || "",
        },
        body: JSON.stringify({ newKey: data.newKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change admin key");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Admin Key Changed",
        description: "Your admin key has been successfully updated.",
      });
      changeKeyForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change admin key",
        variant: "destructive",
      });
    },
  });

  // Handle admin login
  const handleLogin = async (values: AuthFormValues) => {
    const success = await validateAdminKey(values.adminKey);
    if (success) {
      toast({
        title: "Authenticated",
        description: "You are now logged in as admin",
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
      description: "You have been logged out",
    });
    setLocation("/");
  };

  // Handle product form submission
  const onSubmitProduct = (data: ProductFormValues) => {
    if (editingProduct) {
      updateProductMutation.mutate({
        ...data,
        id: editingProduct.id,
      } as Product);
    } else {
      addProductMutation.mutate(data);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      oldPrice: product.old_price || null,
      image: product.image,
      categoryId: product.categoryId || product.category_id, // Handle both field names
      rating: product.rating,
      isNew: product.isNew,
      isOrganic: product.isOrganic,
      isBestseller: product.isBestseller,
      details: Array.isArray(product.details) ? product.details : [],
      newImage: "", //Added for new image upload
    });
    };

  const handleEditBlogPost = (post: BlogPost) => {
    setEditingBlogPost(post);
    blogForm.reset({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      image: post.image,
      category: post.category,
      date: new Date(post.date).toISOString().split("T")[0],
      tags: post.tags || "",
      author: post.author || "",
      metaTitle: post.meta_title || "",
      metaDescription: post.meta_description || "",
      featured: post.featured || false,
      status: post.status || "published",
    });
  };

  // Handle blog form submission
  const onSubmitBlog = (data: BlogFormValues) => {
    addBlogMutation.mutate(data);
  };

  // Generate slug from name/title
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
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
              <CardDescription>
                Enter your admin key to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...authForm}>
                <form
                  onSubmit={authForm.handleSubmit(handleLogin)}
                  className="space-y-4"
                >
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
                    {authForm.formState.isSubmitting
                      ? "Logging in..."
                      : "Login"}
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
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Change Admin Key</CardTitle>
            <CardDescription>Update your admin access key</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...changeKeyForm}>
              <form
                onSubmit={changeKeyForm.handleSubmit(handleChangeKey)}
                className="space-y-4"
              >
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
                  disabled={
                    changeKeyForm.formState.isSubmitting ||
                    changeKeyMutation.isPending
                  }
                >
                  {changeKeyForm.formState.isSubmitting ||
                  changeKeyMutation.isPending
                    ? "Updating..."
                    : "Update Key"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Thêm Danh Mục Mới</CardTitle>
                <CardDescription>
                  Tạo danh mục sản phẩm mới
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...categoryForm}>
                  <form
                    onSubmit={categoryForm.handleSubmit(onSubmitCategory)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={categoryForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên danh mục</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="VD: Rau củ hữu cơ"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (!categoryForm.getValues("slug")) {
                                    categoryForm.setValue(
                                      "slug",
                                      generateSlug(e.target.value),
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={categoryForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input placeholder="rau-cu-huu-co" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={categoryForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ảnh danh mục</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="/images/categories/vegetables.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Sử dụng đường dẫn từ thư mục public (VD: /images/categories/vegetables.jpg) hoặc URL đầy đủ
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={addCategoryMutation.isPending}
                    >
                      {addCategoryMutation.isPending ? "Đang thêm..." : "Thêm danh mục"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Category List */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Danh mục hiện có</h3>
              <div className="grid gap-4">
                {categories?.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-sm text-gray-500">{category.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDeleteCategory(category.id)}
                        variant="destructive"
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

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
                  <form
                    onSubmit={productForm.handleSubmit(onSubmitProduct)}
                    className="space-y-4"
                  >
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
                                    productForm.setValue(
                                      "slug",
                                      generateSlug(e.target.value),
                                    );
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
                            <FormLabel>Price (₫)</FormLabel>
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
                            <FormLabel>Old Price (₫) (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="12.99"
                                {...field}
                                value={field.value === null ? "" : field.value}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? null
                                      : parseFloat(e.target.value);
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
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
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
                          <FormLabel>Image Path</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="/images/products/product-1.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Use relative path from public folder (e.g. /images/products/product-1.jpg) or a full URL.
                          </FormDescription>
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

                    <FormField
                      control={productForm.control}
                      name="details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Chi tiết sản phẩm (mỗi dòng là một điểm)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="- 100% hữu cơ&#13;&#10;- Giàu dinh dưỡng&#13;&#10;- Không chất bảo quản"
                              className="min-h-[100px]"
                              onChange={(e) => {
                                const details = e.target.value
                                  .split("\n")
                                  .map(line => line.startsWith("-") ? line : `- ${line}`)
                                  .filter(line => line.length > 1);
                                field.onChange(details);
                              }}
                              value={
                                Array.isArray(field.value)
                                  ? field.value.join("\n")
                                  : field.value || ""
                              }
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

                    {/* Product Images Section */}
                    {editingProduct && (
                      <div className="space-y-4 border p-4 rounded-lg">
                        <h3 className="font-semibold">Product Images</h3>

                        {/* Image Upload Form */}
                        <div className="space-y-2">
                          <FormField
                            control={productForm.control}
                            name="newImage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Add New Image</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="/images/products/product-2.jpg"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const imagePath = productForm.getValues("newImage");
                                if (imagePath) {
                                  fetch(`/api/admin/products/${editingProduct.id}/images`, {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      "Admin-Key": adminKey,
                                    },
                                    body: JSON.stringify({
                                      imagePath,
                                      productId: editingProduct.id,
                                      isMain: false,
                                      displayOrder: 0
                                    }),
                                  }).then(() => {
                                    queryClient.invalidateQueries({ queryKey: [`/api/products/${editingProduct.id}/images`] });
                                    productForm.setValue("newImage", "");
                                    toast({
                                      title: "Image Added",
                                      description: "Product image has been added successfully",
                                    });
                                  });
                                }
                              }}
                            >
                              Add Image
                            </Button>
                          </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                          {productImages?.map((image) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.imagePath}
                                alt="Product"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    fetch(`/api/admin/product-images/${image.id}/set-main`, {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                        "Admin-Key": adminKey,
                                      },
                                      body: JSON.stringify({
                                        productId: editingProduct.id
                                      }),
                                    }).then(() => {
                                      queryClient.invalidateQueries({ queryKey: [`/api/products/${editingProduct.id}/images`] });
                                      toast({
                                        title: "Main Image Set",
                                        description: "Main product image has been updated",
                                      });
                                    });
                                  }}
                                >
                                  Set Main
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this image?")) {
                                      fetch(`/api/admin/product-images/${image.id}`, {
                                        method: "DELETE",
                                        headers: {
                                          "Admin-Key": adminKey,
                                        },
                                      }).then(() => {
                                        queryClient.invalidateQueries({ queryKey: [`/api/products/${editingProduct.id}/images`] });
                                        toast({
                                          title: "Image Deleted",
                                          description: "Product image has been deleted",
                                        });
                                      });
                                    }
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                              {image.isMain && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                  Main
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        addProductMutation.isPending ||
                        updateProductMutation.isPending
                      }
                    >
                      {editingProduct
                        ? updateProductMutation.isPending
                          ? "Updating..."
                          : "Update Product"
                        : addProductMutation.isPending
                          ? "Adding..."
                          : "Add Product"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Product List */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Existing Products</h3>
              <div className="grid gap-4">
                {products?.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-500">
                          {product.price.toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditProduct(product)}
                        variant="outline"
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        onClick={() => handleDeleteProduct(product.id)}
                        variant="destructive"
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                  <form
                    onSubmit={blogForm.handleSubmit(onSubmitBlog)}
                    className="space-y-4"
                  >
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
                                    blogForm.setValue(
                                      "slug",
                                      generateSlug(e.target.value),
                                    );
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
                        render={({field }) => (
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
                            <Input
                              placeholder="Brief summary of the blog post"
                              {...field}
                            />
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
                                onChange={(value) =>
                                  field.onChange(value || "")
                                }
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
                              <Input
                                placeholder="e.g. Nutrition, Recipes"
                                {...field}
                              />
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
                          <FormLabel>Image Path</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="/images/blog/post-1.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Use relative path from public folder (e.g. /images/blog/post-1.jpg) or a full URL.
                          </FormDescription>
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
                              <Input
                                placeholder="organic,nutrition,tips"
                                {...field}
                              />
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
                              <Input
                                placeholder="Meta title for SEO"
                                {...field}
                              />
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
                              <Input
                                placeholder="Meta description for SEO"
                                {...field}
                              />
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
                              <p className="text-sm text-muted-foreground">
                                Feature this post on the homepage
                              </p>
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
                      disabled={
                        addBlogMutation.isPending ||
                        updateBlogMutation.isPending
                      }
                    >
                      {editingBlogPost
                        ? updateBlogMutation.isPending
                          ? "Updating..."
                          : "Update Blog Post"
                        : addBlogMutation.isPending
                          ? "Adding..."
                          : "Add Blog Post"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Blog Post List */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                Existing Blog Posts
              </h3>
              <div className="grid gap-4">
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">{post.title}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(post.date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditBlogPost(post)}
                        variant="outline"
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        onClick={() => handleDeleteBlogPost(post.id)}
                        variant="destructive"
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}