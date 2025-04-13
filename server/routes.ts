import express, { Express, Request, Response, NextFunction } from "express";
import { Server, createServer } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import * as schema from "@shared/schema";
import {
  sendOrderNotification,
  sendContactNotification,
  sendNewsletterNotification,
} from "./telegram";
import { insertProductSchema, insertBlogPostSchema, insertContactSchema } from "@shared/schema";

const ADMIN_KEY = process.env.ADMIN_KEY || "secret-key-1234";

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized: No API key provided" });
  }

  // Try stored admin key first
  if (await storage.verifyAdminKey(authorization)) {
    return next();
  }

  // Fall back to environment variable admin key
  if (authorization === ADMIN_KEY) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized: Invalid API key" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with prefix /api

  // Categories
  app.get("/api/categories", async (req: Request, res: Response) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    const category = await storage.getCategoryBySlug(slug);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  });

  // Products
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return res.status(400).json({ message: "Invalid pagination parameters" });
      }

      const allProducts = await storage.getProducts();

      // Manual pagination since we're using in-memory storage
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedProducts = allProducts.slice(startIndex, endIndex);

      res.json({
        products: paginatedProducts,
        pagination: {
          total: allProducts.length,
          page,
          limit,
          totalPages: Math.ceil(allProducts.length / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/category/:categoryId", async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.categoryId);

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const products = await storage.getProductsByCategory(categoryId);

    res.json(products);
  });

  app.get("/api/products/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    const product = await storage.getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  });

  app.get("/api/featured-products", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;

      if (isNaN(limit) || limit < 1) {
        return res.status(400).json({ message: "Invalid limit parameter" });
      }

      const products = await storage.getFeaturedProducts(limit);

      res.json({
        products: products,
        pagination: {
          total: products.length,
          page: 1,
          limit: limit,
          totalPages: 1
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  // Admin Product Management
  app.post("/api/admin/products", adminAuth, async (req: Request, res: Response) => {
    try {
      try {
        insertProductSchema.parse(req.body);
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          return res.status(400).json({ 
            message: "Invalid product data", 
            errors: validationError.errors 
          });
        }
        throw validationError;
      }

      const newProduct = await storage.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      try {
        // Create a partial schema validator that allows updating only some fields
        const partialSchema = insertProductSchema.partial();
        partialSchema.parse(req.body);

        const productData = req.body;
        const updatedProduct = await storage.updateProduct(id, productData);

        if (!updatedProduct) {
          return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          return res.status(400).json({ 
            message: "Invalid product data", 
            errors: validationError.errors 
          });
        }
        throw validationError;
      }
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(204).end();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Blog
  app.get("/api/blog-posts", async (req: Request, res: Response) => {
    const blogPosts = await storage.getBlogPosts();
    res.json(blogPosts);
  });

  app.get("/api/blog-posts/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    const blogPost = await storage.getBlogPostBySlug(slug);

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Format date in Vietnamese
    const formattedDate = format(new Date(blogPost.date), "dd MMMM, yyyy", { locale: vi });

    res.json({
      ...blogPost,
      formattedDate
    });
  });

  app.get("/api/recent-blog-posts", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
    
    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ message: "Invalid limit parameter" });
    }
    
    const recentPosts = await storage.getRecentBlogPosts(limit);
    
    // Format dates in Vietnamese
    const postsWithFormattedDates = recentPosts.map(post => ({
      ...post,
      formattedDate: format(new Date(post.date), "dd MMMM, yyyy", { locale: vi })
    }));
    
    res.json(postsWithFormattedDates);
  });

  // Admin Blog Management
  app.post("/api/admin/blog-posts", adminAuth, async (req: Request, res: Response) => {
    try {
      try {
        insertBlogPostSchema.parse(req.body);
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          return res.status(400).json({ 
            message: "Invalid blog post data", 
            errors: validationError.errors 
          });
        }
        throw validationError;
      }

      const newBlogPost = await storage.createBlogPost(req.body);
      res.status(201).json(newBlogPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog-posts/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }

      try {
        // Create a partial schema validator that allows updating only some fields
        const partialSchema = insertBlogPostSchema.partial();
        partialSchema.parse(req.body);

        const blogPostData = req.body;
        const updatedBlogPost = await storage.updateBlogPost(id, blogPostData);

        if (!updatedBlogPost) {
          return res.status(404).json({ message: "Blog post not found" });
        }

        res.json(updatedBlogPost);
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          return res.status(400).json({ 
            message: "Invalid blog post data", 
            errors: validationError.errors 
          });
        }
        throw validationError;
      }
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog-posts/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }

      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.status(204).end();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (req: Request, res: Response) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });

  // Admin Authentication
  app.post("/api/admin/verify", async (req: Request, res: Response) => {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ message: "API key is required" });
    }

    if (key === ADMIN_KEY || await storage.verifyAdminKey(key)) {
      return res.json({ valid: true });
    }

    res.json({ valid: false });
  });

  app.post("/api/admin/key", adminAuth, async (req: Request, res: Response) => {
    const { oldKey, newKey } = req.body;

    if (!oldKey || !newKey) {
      return res.status(400).json({ message: "Both old and new API keys are required" });
    }

    if (!(oldKey === ADMIN_KEY || await storage.verifyAdminKey(oldKey))) {
      return res.status(401).json({ message: "Invalid old API key" });
    }

    try {
      if (oldKey === ADMIN_KEY) {
        // Creating first database key
        await storage.updateAdminKey("", newKey);
      } else {
        // Updating existing key
        await storage.updateAdminKey(oldKey, newKey);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating admin key:", error);
      res.status(500).json({ message: "Failed to update API key" });
    }
  });

  // Orders
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      // Validate order data
      const { customerName, email, phone, address, cart, totalAmount } = req.body;
      
      if (!customerName || !email || !phone || !address || !cart || cart.length === 0 || !totalAmount) {
        return res.status(400).json({ message: "Missing required order information" });
      }

      const newOrder = await storage.createOrder({
        name: customerName,
        email,
        phone,
        address,
        items: JSON.stringify(cart),
        total: totalAmount,
        status: "pending"
      });

      // Send Telegram notification
      try {
        await sendOrderNotification(newOrder, cart);
      } catch (notificationError) {
        console.error("Failed to send order notification:", notificationError);
        // Continue with the order process even if notification fails
      }

      res.status(201).json({
        success: true,
        orderId: newOrder.id,
        message: "Đặt hàng thành công"
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Lỗi khi xử lý đơn hàng" });
    }
  });

  // Contact form
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      try {
        insertContactSchema.parse(req.body);
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          return res.status(400).json({ 
            message: "Invalid contact form data", 
            errors: validationError.errors 
          });
        }
        throw validationError;
      }

      const { name, email, phone, message } = req.body;
      const contact = await storage.submitContactForm({
        name,
        email,
        subject: "Contact Form Submission",
        message
      });

      // Send Telegram notification
      try {
        await sendContactNotification(contact);
      } catch (notificationError) {
        console.error("Failed to send contact form notification:", notificationError);
        // Continue with the contact form process even if notification fails
      }

      res.status(201).json({
        success: true,
        message: "Thông tin liên hệ đã được gửi thành công"
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Lỗi khi gửi thông tin liên hệ" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Send Telegram notification
      try {
        await sendNewsletterNotification(email);
      } catch (notificationError) {
        console.error("Failed to send newsletter subscription notification:", notificationError);
        // Continue with the subscription process even if notification fails
      }

      res.status(201).json({
        success: true,
        message: "Đăng ký nhận tin thành công"
      });
    } catch (error) {
      console.error("Error processing newsletter subscription:", error);
      res.status(500).json({ message: "Lỗi khi đăng ký nhận tin" });
    }
  });

  // Admin Category Management
  app.post("/api/admin/categories", adminAuth, async (req: Request, res: Response) => {
    try {
      const { name, slug, description } = req.body;
      
      if (!name || !slug) {
        return res.status(400).json({ message: "Category name and slug are required" });
      }

      const newCategory = await storage.createCategory({
        name,
        slug,
        image: ""
      });

      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Product Images
  app.get("/api/products/:productId/images", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const images = await storage.getProductImages(productId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching product images:", error);
      res.status(500).json({ message: "Failed to fetch product images" });
    }
  });

  app.post("/api/admin/products/:productId/images", adminAuth, async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const { url, alt, isMain } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "Image URL is required" });
      }

      const newImage = await storage.addProductImage({
        productId,
        imagePath: url,
        displayOrder: 0,
        isMain: isMain || false
      });

      // If this is marked as main, update other images
      if (isMain) {
        await storage.setMainProductImage(newImage.id, productId);
      }

      res.status(201).json(newImage);
    } catch (error) {
      console.error("Error adding product image:", error);
      res.status(500).json({ message: "Failed to add product image" });
    }
  });

  app.put("/api/admin/product-images/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid image ID" });
      }

      const { url, alt, isMain } = req.body;
      const updates: any = {};
      
      if (url !== undefined) updates.imagePath = url;
      if (isMain !== undefined) updates.isMain = isMain;
      if (alt !== undefined) updates.displayOrder = 0; // Use displayOrder instead of alt

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No update data provided" });
      }

      const updatedImage = await storage.updateProductImage(id, updates);

      if (!updatedImage) {
        return res.status(404).json({ message: "Image not found" });
      }

      // If this is marked as main, update other images
      if (isMain) {
        await storage.setMainProductImage(id, updatedImage.productId);
      }

      res.json(updatedImage);
    } catch (error) {
      console.error("Error updating product image:", error);
      res.status(500).json({ message: "Failed to update product image" });
    }
  });

  app.delete("/api/admin/product-images/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid image ID" });
      }

      const success = await storage.deleteProductImage(id);
      
      if (!success) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.status(204).end();
    } catch (error) {
      console.error("Error deleting product image:", error);
      res.status(500).json({ message: "Failed to delete product image" });
    }
  });

  app.post("/api/admin/product-images/:id/set-main", adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid image ID" });
      }

      const { productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const success = await storage.setMainProductImage(id, productId);
      
      if (!success) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error setting main product image:", error);
      res.status(500).json({ message: "Failed to set main product image" });
    }
  });

  // Don't create a new server here; just return an empty Express server
  return createServer(app);
}