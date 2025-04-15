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
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  // Blog Posts
  app.get("/api/blog-posts", async (req: Request, res: Response) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;

      if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return res.status(400).json({ message: "Invalid pagination parameters" });
      }

      const allPosts = await storage.getBlogPosts();

      // Manual pagination
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
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/recent-blog-posts", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;

      if (isNaN(limit) || limit < 1) {
        return res.status(400).json({ message: "Invalid limit parameter" });
      }

      const posts = await storage.getRecentBlogPosts(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent blog posts" });
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (req: Request, res: Response) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  

  // Orders
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      // Validate order data
      const { customerName, email, phone, address, cart, totalAmount } = req.body;
      
      if (!customerName || !email || !phone || !address || !cart || cart.length === 0 || !totalAmount) {
        console.error("Missing order data:", { customerName, email, phone, address, cart: cart ? cart.length : 'no cart', totalAmount });
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

  // Product Variants
  app.get("/api/products/:productId/variants", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const variants = await storage.getProductVariants(productId);
      res.json(variants);
    } catch (error) {
      console.error("Error fetching product variants:", error);
      res.status(500).json({ message: "Failed to fetch product variants" });
    }
  });

  app.get("/api/variants/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid variant ID" });
      }

      const variant = await storage.getProductVariant(id);
      
      if (!variant) {
        return res.status(404).json({ message: "Variant not found" });
      }
      
      res.json(variant);
    } catch (error) {
      console.error("Error fetching product variant:", error);
      res.status(500).json({ message: "Failed to fetch product variant" });
    }
  });

  app.post("/api/products/:productId/variants", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const { name, price, oldPrice, sku, stock, isDefault } = req.body;
      
      if (!name || typeof price !== 'number') {
        return res.status(400).json({ message: "Name and price are required for product variants" });
      }
      
      const newVariant = await storage.addProductVariant({
        productId,
        name,
        price,
        oldPrice,
        sku,
        stock,
        isDefault: isDefault || false
      });
      
      res.status(201).json(newVariant);
    } catch (error) {
      console.error("Error creating product variant:", error);
      res.status(500).json({ message: "Failed to create product variant" });
    }
  });

  app.put("/api/variants/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid variant ID" });
      }
      
      const { name, price, oldPrice, sku, stock, isDefault } = req.body;
      
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "No update data provided" });
      }
      
      const updatedVariant = await storage.updateProductVariant(id, {
        name,
        price,
        oldPrice,
        sku,
        stock,
        isDefault
      });
      
      if (!updatedVariant) {
        return res.status(404).json({ message: "Variant not found" });
      }
      
      res.json(updatedVariant);
    } catch (error) {
      console.error("Error updating product variant:", error);
      res.status(500).json({ message: "Failed to update product variant" });
    }
  });

  app.delete("/api/variants/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid variant ID" });
      }
      
      const result = await storage.deleteProductVariant(id);
      
      if (!result) {
        return res.status(404).json({ message: "Variant not found" });
      }
      
      res.json({ success: true, message: "Variant deleted successfully" });
    } catch (error) {
      console.error("Error deleting product variant:", error);
      res.status(500).json({ message: "Failed to delete product variant" });
    }
  });

  app.post("/api/variants/:id/set-default", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { productId } = req.body;
      
      if (isNaN(id) || isNaN(productId)) {
        return res.status(400).json({ message: "Invalid variant or product ID" });
      }
      
      const result = await storage.setDefaultProductVariant(id, productId);
      
      if (!result) {
        return res.status(404).json({ message: "Variant not found" });
      }
      
      res.json({ success: true, message: "Default variant set successfully" });
    } catch (error) {
      console.error("Error setting default variant:", error);
      res.status(500).json({ message: "Failed to set default variant" });
    }
  });

  // Don't create a new server here; just return an empty Express server
  return createServer(app);
}