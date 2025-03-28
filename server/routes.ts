import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertContactSchema, CartItem, insertProductSchema, baseBlogPostSchema } from "@shared/schema";
import { ZodError } from "zod";
import fetch from "node-fetch";
import { sendOrderNotification } from "./telegram";

// Environment variable for admin key or fallback to a default for development
const ADMIN_KEY = process.env.ADMIN_KEY || "secret-admin-key";

// Simple authentication middleware for admin routes
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const adminKey = req.headers['admin-key'];
  
  // Very basic auth - in a real app, use proper authentication
  if (adminKey === ADMIN_KEY) {
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
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
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
      
      // Validate product data - even though it's partial, we should still validate what's provided
      try {
        // Apply partial validation to the fields that are present
        const providedFields = Object.keys(req.body);
        
        // Create a partial schema based on which fields are provided
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
      res.status(500).json({ message: "Internal server error" });
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
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Blog posts
  app.get("/api/blog-posts", async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return res.status(400).json({ message: "Invalid pagination parameters" });
      }
      
      const allPosts = await storage.getBlogPosts();
      
      // Manual pagination since we're using in-memory storage
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedPosts = allPosts.slice(startIndex, endIndex);
      
      res.json({
        posts: paginatedPosts,
        pagination: {
          total: allPosts.length,
          page,
          limit,
          totalPages: Math.ceil(allPosts.length / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
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
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      
      if (isNaN(limit) || limit < 1) {
        return res.status(400).json({ message: "Invalid limit parameter" });
      }
      
      const posts = await storage.getRecentBlogPosts(limit);
      
      res.json({
        posts: posts,
        pagination: {
          total: posts.length,
          page: 1,
          limit: limit,
          totalPages: 1
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent blog posts" });
    }
  });
  
  // Admin Blog Post Management
  app.post("/api/admin/blog-posts", adminAuth, async (req: Request, res: Response) => {
    try {
      // We're using the base schema which doesn't have date preprocessing
      const blogPostData = { ...req.body };
      if (typeof blogPostData.date === 'string') {
        blogPostData.date = new Date(blogPostData.date);
      }
      
      const validatedData = baseBlogPostSchema.parse(blogPostData);
      const blogPost = await storage.createBlogPost(validatedData);
      res.status(201).json(blogPost);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
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
      
      // Validate blog post data with partial schema
      try {
        // Handle date conversion manually
        let blogPostData = { ...req.body };
        if (typeof blogPostData.date === 'string') {
          blogPostData.date = new Date(blogPostData.date);
        }
        
        // Create a partial schema based on which fields are provided
        const partialSchema = baseBlogPostSchema.partial();
        const validatedData = partialSchema.parse(blogPostData);
        
        const updatedBlogPost = await storage.updateBlogPost(id, validatedData);
        
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
      res.status(500).json({ message: "Internal server error" });
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
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Testimonials
  app.get("/api/testimonials", async (req: Request, res: Response) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });
  
  // Admin Key Verification
  app.post("/api/admin/verify", async (req: Request, res: Response) => {
    const adminKey = req.headers['admin-key'];
    
    if (adminKey === ADMIN_KEY) {
      return res.status(200).json({ message: "Admin key is valid" });
    } else {
      return res.status(401).json({ message: "Invalid admin key" });
    }
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
        // Continue with the order process even if telegram fails
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to process order" });
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
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
