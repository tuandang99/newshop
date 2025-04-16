import { eq, desc, sql, and, like, or } from 'drizzle-orm';
import { db } from './db';
import {
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type BlogPost,
  type InsertBlogPost,
  type Testimonial, 
  type InsertTestimonial,
  type Order,
  type InsertOrder,
  type ContactSubmission,
  type InsertContact,
  type AdminKey,
  type InsertAdminKey,
  type ProductImage,
  type InsertProductImage,
  categories,
  products,
  blogPosts,
  testimonials,
  orders,
  contacts,
  adminKeys,
  productImages,
  type ProductVariant,
  type InsertProductVariant,
  productVariants
} from "@shared/schema";

export interface IStorage {
  // Product Variants methods
  getProductVariants(productId: number): Promise<ProductVariant[]>;
  createProductVariant(variant: InsertProductVariant): Promise<ProductVariant>;
  updateProductVariant(id: number, variant: Partial<InsertProductVariant>): Promise<ProductVariant | undefined>;
  deleteProductVariant(id: number): Promise<boolean>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getNewArrivals(limit?: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Product Images methods
  getProductImages(productId: number): Promise<ProductImage[]>;
  addProductImage(image: InsertProductImage): Promise<ProductImage>;
  updateProductImage(id: number, image: Partial<InsertProductImage>): Promise<ProductImage | undefined>;
  deleteProductImage(id: number): Promise<boolean>;
  setMainProductImage(id: number, productId: number): Promise<boolean>;
  
  // Blog methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getRecentBlogPosts(limit?: number): Promise<BlogPost[]>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  
  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Contact methods
  submitContactForm(contact: InsertContact): Promise<ContactSubmission>;
  
  // Admin methods
  verifyAdminKey(key: string): Promise<boolean>;
  updateAdminKey(oldKey: string, newKey: string): Promise<boolean>;
}

// Helper function to normalize product data
function normalizeProduct(product: any): Product {
  return {
    ...product,
    isNew: product.isNew === true || product.is_new === true,
    isOrganic: product.isOrganic === true || product.is_organic === true,
    isBestseller: product.isBestseller === true || product.is_bestseller === true,
  };
}

export class DatabaseStorage implements IStorage {
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const results = await db.select().from(categories).where(eq(categories.slug, slug));
    return results[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async getProducts(): Promise<Product[]> {
    const rawProducts = await db.select().from(products);
    return rawProducts.map(normalizeProduct);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const rawProducts = await db.select().from(products).where(eq(products.categoryId, categoryId));
    return rawProducts.map(normalizeProduct);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const results = await db.select().from(products).where(eq(products.slug, slug));
    return results.length ? normalizeProduct(results[0]) : undefined;
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const rawProducts = await db.select()
      .from(products)
      .where(eq(products.isBestseller, true))
      .limit(limit);
    return rawProducts.map(normalizeProduct);
  }

  async getNewArrivals(limit = 8): Promise<Product[]> {
    const rawProducts = await db.select()
      .from(products)
      .where(eq(products.isNew, true))
      .orderBy(desc(products.createdAt))
      .limit(limit);
    return rawProducts.map(normalizeProduct);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const insertData = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      categoryId: product.categoryId,
      rating: product.rating,
      isNew: product.isNew,
      isOrganic: product.isOrganic,
      isBestseller: product.isBestseller,
      details: product.details,
      discount: product.discount
    };
    
    const result = await db.insert(products).values(insertData);
    const [newProduct] = await db.select().from(products).where(eq(products.slug, product.slug));
    return normalizeProduct(newProduct);
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    // Extract actual fields to update and avoid type issues
    const updateData: Record<string, any> = {};
    
    if (product.name !== undefined) updateData.name = product.name;
    if (product.slug !== undefined) updateData.slug = product.slug;
    if (product.description !== undefined) updateData.description = product.description;
    if (product.price !== undefined) updateData.price = product.price;
    if (product.oldPrice !== undefined) updateData.oldPrice = product.oldPrice;
    if (product.image !== undefined) updateData.image = product.image;
    if (product.categoryId !== undefined) updateData.categoryId = product.categoryId;
    if (product.rating !== undefined) updateData.rating = product.rating;
    if (product.isNew !== undefined) updateData.isNew = product.isNew;
    if (product.isOrganic !== undefined) updateData.isOrganic = product.isOrganic;
    if (product.isBestseller !== undefined) updateData.isBestseller = product.isBestseller;
    if (product.details !== undefined) updateData.details = product.details;
    if (product.discount !== undefined) updateData.discount = product.discount;
    
    const [updatedProduct] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct ? normalizeProduct(updatedProduct) : undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return true; // PostgreSQL doesn't return affected rows in the same way
  }

  async searchProducts(query: string): Promise<Product[]> {
    const rawProducts = await db.select()
      .from(products)
      .where(
        or(
          like(products.name, `%${query}%`),
          like(products.description, `%${query}%`)
        )
      );
    return rawProducts.map(normalizeProduct);
  }

  // Product Images methods
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return await db.select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(productImages.isMain);
  }

  async addProductImage(image: InsertProductImage): Promise<ProductImage> {
    // If isMain is true, reset all other images for this product to isMain=false
    if (image.isMain) {
      await db.update(productImages)
        .set({ isMain: false })
        .where(eq(productImages.productId, image.productId));
    }
    
    const [newImage] = await db.insert(productImages).values(image).returning();
    return newImage;
  }

  async updateProductImage(id: number, image: Partial<InsertProductImage>): Promise<ProductImage | undefined> {
    // If setting as main image, reset all other images for this product
    if (image.isMain) {
      const existingImage = await db.select()
        .from(productImages)
        .where(eq(productImages.id, id));
      
      if (existingImage.length > 0) {
        await db.update(productImages)
          .set({ isMain: false })
          .where(eq(productImages.productId, existingImage[0].productId));
      }
    }
    
    const [updatedImage] = await db
      .update(productImages)
      .set(image)
      .where(eq(productImages.id, id))
      .returning();
    return updatedImage;
  }

  async deleteProductImage(id: number): Promise<boolean> {
    const result = await db.delete(productImages).where(eq(productImages.id, id));
    return true;
  }

  async setMainProductImage(id: number, productId: number): Promise<boolean> {
    // First reset all images for this product
    await db.update(productImages)
      .set({ isMain: false })
      .where(eq(productImages.productId, productId));
    
    // Then set the selected image as main
    await db.update(productImages)
      .set({ isMain: true })
      .where(eq(productImages.id, id));
    
    return true;
  }

  // Product Variants Implementation
  async getProductVariants(productId: number): Promise<ProductVariant[]> {
    return await db.select()
      .from(productVariants)
      .where(eq(productVariants.productId, productId))
      .orderBy(productVariants.name);
  }

  async createProductVariant(variant: InsertProductVariant): Promise<ProductVariant> {
    const [newVariant] = await db.insert(productVariants).values(variant).returning();
    return newVariant;
  }

  async updateProductVariant(id: number, variant: Partial<InsertProductVariant>): Promise<ProductVariant | undefined> {
    const [updatedVariant] = await db
      .update(productVariants)
      .set(variant)
      .where(eq(productVariants.id, id))
      .returning();
    return updatedVariant;
  }

  async deleteProductVariant(id: number): Promise<boolean> {
    await db.delete(productVariants).where(eq(productVariants.id, id));
    return true;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.date));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const results = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return results[0];
  }

  async getRecentBlogPosts(limit = 3): Promise<BlogPost[]> {
    return await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.date))
      .limit(limit);
  }

  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(blogPost).returning();
    return newPost;
  }

  async updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set(blogPost)
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async submitContactForm(contact: InsertContact): Promise<ContactSubmission> {
    const [submission] = await db.insert(contacts).values(contact).returning();
    return submission;
  }

  async verifyAdminKey(key: string): Promise<boolean> {
    const results = await db.select()
      .from(adminKeys)
      .where(and(eq(adminKeys.key, key), eq(adminKeys.active, true)));
    return results.length > 0;
  }

  async updateAdminKey(oldKey: string, newKey: string): Promise<boolean> {
    const results = await db.select()
      .from(adminKeys)
      .where(and(eq(adminKeys.key, oldKey), eq(adminKeys.active, true)));
    
    if (results.length > 0) {
      await db.update(adminKeys)
        .set({ key: newKey })
        .where(eq(adminKeys.id, results[0].id));
      return true;
    }
    return false;
  }
}

export const storage = new DatabaseStorage();