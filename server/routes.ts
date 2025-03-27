import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertContactSchema } from "@shared/schema";
import { ZodError } from "zod";
import fetch from "node-fetch";
import { sendOrderNotification } from "./telegram";

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
    const products = await storage.getProducts();
    res.json(products);
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
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const products = await storage.getFeaturedProducts(limit);
    res.json(products);
  });
  
  // Blog posts
  app.get("/api/blog-posts", async (req: Request, res: Response) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });
  
  app.get("/api/blog-posts/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    const post = await storage.getBlogPostBySlug(slug);
    
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    
    res.json(post);
  });
  
  app.get("/api/recent-blog-posts", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const posts = await storage.getRecentBlogPosts(limit);
    res.json(posts);
  });
  
  // Testimonials
  app.get("/api/testimonials", async (req: Request, res: Response) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });
  
  // Orders with Telegram integration
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Send notification using our Telegram service
      try {
        const notificationSent = await sendOrderNotification(order);
        if (notificationSent) {
          console.log(`Telegram notification sent for order #${order.id}`);
        } else {
          console.log(`Failed to send Telegram notification for order #${order.id}`);
        }
      } catch (error) {
        console.error('Error in Telegram notification:', error);
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      throw error;
    }
  });
  
  // Contact form submissions
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const submission = await storage.submitContactForm(contactData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid contact form data", errors: error.errors });
      }
      throw error;
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
