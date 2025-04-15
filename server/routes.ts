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
      console.error("Error fetching products:", error);
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

  // Blog
  app.get("/api/blog-posts", async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
        return res.status(400).json({ message: "Invalid pagination parameters" });
      }
      
      const blogPosts = await storage.getBlogPosts();
      
      // Format dates
      const postsWithFormattedDates = blogPosts.map(post => ({
        ...post,
        formattedDate: format(new Date(post.date || new Date()), "dd MMMM, yyyy", { locale: vi })
      }));
      
      res.json({
        posts: postsWithFormattedDates,
        pagination: {
          total: postsWithFormattedDates.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil(postsWithFormattedDates.length / limit)
        }
      });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    const blogPost = await storage.getBlogPostBySlug(slug);

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Format date in Vietnamese
    const formattedDate = format(new Date(blogPost.date || new Date()), "dd MMMM, yyyy", { locale: vi });

    res.json({
      ...blogPost,
      formattedDate
    });
  });

  app.get("/api/recent-blog-posts", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      
      if (isNaN(limit) || limit < 1) {
        return res.status(400).json({ message: "Invalid limit parameter" });
      }
      
      const recentPosts = await storage.getRecentBlogPosts(limit);
      
      // Format dates in Vietnamese
      const postsWithFormattedDates = recentPosts.map(post => ({
        ...post,
        formattedDate: format(new Date(post.date || new Date()), "dd MMMM, yyyy", { locale: vi })
      }));
      
      res.json({
        posts: postsWithFormattedDates,
        pagination: {
          total: postsWithFormattedDates.length,
          page: 1,
          limit: limit,
          totalPages: 1
        }
      });
    } catch (error) {
      console.error("Error fetching recent blog posts:", error);
      res.status(500).json({ message: "Failed to fetch recent blog posts" });
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (req: Request, res: Response) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });

  

  // Orders
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      // Validate order data
      const {
        name: customerName,
        phone,
        address,
        items: cart,
        total: totalAmount,
        email = "" // optional if frontend doesn't provide it
      } = req.body;

      if (!customerName || !phone || !address || !cart || cart.length === 0 || !totalAmount) {
        return res.status(400).json({ message: "Missing required order information" });
      }

      const newOrder = await storage.createOrder({
        name: customerName,
        email,
        phone,
        address,
        items: JSON.stringify(cart),
        total: totalAmount
      });

      // Send Telegram notification
      try {
        // Convert cart to array if needed
        const cartItems = Array.isArray(cart) ? cart : 
                         (typeof cart === 'string' ? JSON.parse(cart) : []);
        
        await sendOrderNotification(newOrder, cartItems);
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

  // Don't create a new server here; just return an empty Express server
  return createServer(app);
}