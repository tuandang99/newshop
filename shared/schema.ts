import { z } from "zod";

// Product Category
export const insertCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  image: z.string(),
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = InsertCategory & { id: number };

// Product
export const insertProductSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  oldPrice: z.number().nullable(),
  image: z.string(),
  categoryId: z.number(),
  rating: z.number().default(5),
  isNew: z.boolean().default(false),
  isOrganic: z.boolean().default(true),
  isBestseller: z.boolean().default(false),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = InsertProduct & { id: number };

// Blog Post
export const insertBlogPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string(),
  image: z.string(),
  category: z.string(),
  tags: z.string().optional(),
  author: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["published", "draft", "archived"]).optional(),
  date: z.date(),
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = InsertBlogPost & { id: number };

// Testimonials
export const insertTestimonialSchema = z.object({
  name: z.string(),
  avatar: z.string(),
  rating: z.number(),
  comment: z.string(),
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = InsertTestimonial & { id: number };

// Orders
export const insertOrderSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  items: z.string(),
  total: z.number(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = InsertOrder & { 
  id: number;
  status: string;
  createdAt: Date;
};

// Contact Form Submissions
export const insertContactSchema = z.object({
  name: z.string(),
  email: z.string(),
  subject: z.string(),
  message: z.string(),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = InsertContact & {
  id: number;
  createdAt: Date;
};

// Cart Item type (not stored in database, used for frontend)
export const cartItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  quantity: z.number(),
});

export type CartItem = z.infer<typeof cartItemSchema>;