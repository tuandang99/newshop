import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertContactSchema, CartItem, insertProductSchema, insertBlogPostSchema } from "@shared/schema";
import { ZodError } from "zod";
import fetch from "node-fetch";
import { sendOrderNotification } from "./telegram";

// Simple authentication middleware for admin routes
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const adminKey = req.headers['admin-key'];
  
  // Very basic auth - in a real app, use proper authentication
  if (adminKey === 'secret-admin-key') {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized - Admin access required" });
  }
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
  
  // Admin Product Management
  app.post("/api/admin/products", adminAuth, async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      throw error;
    }
  });
  
  app.put("/api/admin/products/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      // Partial validation of product data
      const productData = req.body;
      const updatedProduct = await storage.updateProduct(id, productData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      throw error;
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
      throw error;
    }
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
  
  // Admin Blog Post Management
  app.post("/api/admin/blog-posts", adminAuth, async (req: Request, res: Response) => {
    try {
      const blogPostData = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost(blogPostData);
      res.status(201).json(blogPost);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
      throw error;
    }
  });
  
  app.put("/api/admin/blog-posts/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      // Partial validation of blog post data
      const blogPostData = req.body;
      const updatedBlogPost = await storage.updateBlogPost(id, blogPostData);
      
      if (!updatedBlogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(updatedBlogPost);
    } catch (error) {
      throw error;
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
      throw error;
    }
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
      
      // Send Telegram notification using our new service
      try {
        // Parse the cart items from the JSON string
        const cartItems = JSON.parse(orderData.items) as CartItem[];
        
        // Send notification to Telegram
        await sendOrderNotification(order, cartItems);
        
        console.log('Telegram notification sent for order #' + order.id);
      } catch (error) {
        console.error('Failed to send Telegram notification:', error);
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
