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
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  
  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getRecentBlogPosts(limit?: number): Promise<BlogPost[]>;
  
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Contact
  submitContactForm(contact: InsertContact): Promise<ContactSubmission>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private blogPosts: Map<number, BlogPost>;
  private testimonials: Map<number, Testimonial>;
  private orders: Map<number, Order>;
  private contactSubmissions: Map<number, ContactSubmission>;
  
  private categoryId: number;
  private productId: number;
  private blogPostId: number;
  private testimonialId: number;
  private orderId: number;
  private contactId: number;

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.blogPosts = new Map();
    this.testimonials = new Map();
    this.orders = new Map();
    this.contactSubmissions = new Map();
    
    this.categoryId = 1;
    this.productId = 1;
    this.blogPostId = 1;
    this.testimonialId = 1;
    this.orderId = 1;
    this.contactId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add categories
    const categoriesData: InsertCategory[] = [
      {
        name: "Nuts & Seeds",
        slug: "nuts-seeds",
        image: "https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        name: "Granola Bars",
        slug: "granola-bars",
        image: "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        name: "Cereals",
        slug: "cereals",
        image: "https://images.unsplash.com/photo-1516747773440-e114f698cdbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        name: "Dried Fruits",
        slug: "dried-fruits",
        image: "https://images.unsplash.com/photo-1583075450908-3a71981979f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      },
      {
        name: "Superfoods",
        slug: "superfoods",
        image: "https://images.unsplash.com/photo-1612706179950-0693fad5c93b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      }
    ];
    
    categoriesData.forEach(category => {
      const id = this.categoryId++;
      this.categories.set(id, { ...category, id });
    });
    
    // Add products
    const productsData: InsertProduct[] = [
      {
        name: "Mixed Premium Nuts",
        slug: "mixed-premium-nuts",
        description: "Organic assortment of almonds, cashews, and walnuts",
        price: 12.99,
        oldPrice: 15.99,
        image: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80",
        categoryId: 1,
        rating: 4.8,
        isNew: true,
        isOrganic: true,
        isBestseller: false
      },
      {
        name: "Honey Granola Bars",
        slug: "honey-granola-bars",
        description: "Crunchy granola with organic honey, 6-pack",
        price: 8.49,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1628676633317-1fe213131fcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80",
        categoryId: 2,
        rating: 4.7,
        isNew: false,
        isOrganic: true,
        isBestseller: false
      },
      {
        name: "Ancient Grain Cereal",
        slug: "ancient-grain-cereal",
        description: "Quinoa, amaranth and chia seed breakfast mix",
        price: 9.99,
        oldPrice: 11.99,
        image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80",
        categoryId: 3,
        rating: 4.9,
        isNew: false,
        isOrganic: true,
        isBestseller: false
      },
      {
        name: "Mixed Dried Berries",
        slug: "mixed-dried-berries",
        description: "Goji, cranberries, and blueberries superfood mix",
        price: 14.99,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1599639957043-f9b395235a27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80",
        categoryId: 4,
        rating: 4.6,
        isNew: false,
        isOrganic: true,
        isBestseller: false
      },
      {
        name: "Energy Trail Mix",
        slug: "energy-trail-mix",
        description: "Nuts, seeds and dark chocolate energy booster",
        price: 10.99,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1582663801721-f176239fc911?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80",
        categoryId: 1,
        rating: 4.8,
        isNew: false,
        isOrganic: true,
        isBestseller: false
      },
      {
        name: "Organic Chia Seeds",
        slug: "organic-chia-seeds",
        description: "Premium organic chia seeds, rich in omega-3",
        price: 7.99,
        oldPrice: 9.99,
        image: "https://images.unsplash.com/photo-1584549239366-3c5e56d73d34?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80",
        categoryId: 5,
        rating: 4.7,
        isNew: false,
        isOrganic: true,
        isBestseller: false
      },
      {
        name: "Protein Granola Bars",
        slug: "protein-granola-bars",
        description: "High protein bars with nuts and dark chocolate",
        price: 11.49,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1599002354738-65a7d5c28766?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80",
        categoryId: 2,
        rating: 4.9,
        isNew: false,
        isOrganic: true,
        isBestseller: true
      },
      {
        name: "Gluten-Free Granola",
        slug: "gluten-free-granola",
        description: "Crunchy gluten-free granola with maple syrup",
        price: 9.29,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1584487500215-a56becac2c77?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80",
        categoryId: 3,
        rating: 4.5,
        isNew: false,
        isOrganic: true,
        isBestseller: false
      }
    ];
    
    productsData.forEach(product => {
      const id = this.productId++;
      this.products.set(id, { ...product, id });
    });
    
    // Add blog posts
    const blogPostsData: InsertBlogPost[] = [
      {
        title: "5 Ways Nuts Can Boost Your Health",
        slug: "5-ways-nuts-can-boost-your-health",
        content: "Nuts are packed with nutrients that can have a positive impact on your health. Here are five ways that nuts can boost your health:\n\n1. **Heart Health**: Nuts contain unsaturated fats, which can help lower bad cholesterol levels and reduce the risk of heart disease.\n\n2. **Weight Management**: Despite being high in calories, nuts can actually help with weight management. Their protein and fiber content can keep you feeling full for longer.\n\n3. **Brain Function**: The omega-3 fatty acids found in nuts like walnuts are essential for brain function and development.\n\n4. **Anti-Inflammatory Properties**: Nuts contain various compounds that may help reduce inflammation in the body.\n\n5. **Blood Sugar Control**: The healthy fats, protein, and fiber in nuts can help regulate blood sugar levels.",
        excerpt: "Discover the impressive health benefits of incorporating various nuts into your daily diet.",
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        category: "Nutrition",
        date: new Date("2023-06-15")
      },
      {
        title: "Healthy Breakfast Ideas Using Granola",
        slug: "healthy-breakfast-ideas-using-granola",
        content: "Granola is a versatile and nutritious breakfast option that can be enjoyed in various ways. Here are some healthy breakfast ideas using granola:\n\n1. **Yogurt Parfait**: Layer granola with Greek yogurt and fresh berries for a protein-packed breakfast.\n\n2. **Smoothie Bowl**: Top a thick smoothie with granola for added crunch and nutrients.\n\n3. **Overnight Oats**: Mix granola with oats, milk, and chia seeds, and let it sit overnight for a ready-to-eat breakfast.\n\n4. **Baked Apples**: Fill cored apples with granola and bake for a warm, comforting breakfast.\n\n5. **Banana Boats**: Split a banana lengthwise and fill with granola, nut butter, and a drizzle of honey.",
        excerpt: "Start your day right with these delicious and nutritious breakfast recipes featuring granola.",
        image: "https://images.unsplash.com/photo-1523598455533-144bae6cf56e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        category: "Recipes",
        date: new Date("2023-06-08")
      },
      {
        title: "Why Organic Farming Matters",
        slug: "why-organic-farming-matters",
        content: "Organic farming is becoming increasingly important in today's world. Here's why it matters:\n\n1. **Environmental Protection**: Organic farming practices help protect soil, water, and air quality by avoiding synthetic pesticides and fertilizers.\n\n2. **Biodiversity**: Organic farms tend to have greater biodiversity, which contributes to a healthier ecosystem.\n\n3. **Health Benefits**: Foods grown organically may contain fewer pesticide residues and have higher nutrient levels.\n\n4. **Climate Change Mitigation**: Organic farming can help sequester carbon in the soil, reducing greenhouse gas emissions.\n\n5. **Rural Communities**: Organic farming can help support rural communities by providing sustainable livelihoods.",
        excerpt: "Learn about the environmental and health benefits of supporting organic farming practices.",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        category: "Sustainability",
        date: new Date("2023-05-30")
      }
    ];
    
    blogPostsData.forEach(post => {
      const id = this.blogPostId++;
      this.blogPosts.set(id, { ...post, id });
    });
    
    // Add testimonials
    const testimonialsData: InsertTestimonial[] = [
      {
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        comment: "I've been ordering from NatureNutri for over a year now. Their mixed nuts selection is amazing, and I love that everything is organic. The delivery is always fast, and the products are always fresh!"
      },
      {
        name: "Michael Thompson",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 4.5,
        comment: "As someone who follows a strict diet for health reasons, finding NatureNutri has been a game-changer. Their gluten-free granola is the best I've ever tasted, and I appreciate the transparency about ingredients."
      },
      {
        name: "Emily Rodriguez",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
        comment: "The protein granola bars are my go-to snack for hiking and busy days at work. They taste great and keep me energized. Plus, I love supporting a company that cares about sustainability."
      }
    ];
    
    testimonialsData.forEach(testimonial => {
      const id = this.testimonialId++;
      this.testimonials.set(id, { ...testimonial, id });
    });
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.categoryId === categoryId);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.slug === slug);
  }
  
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    return Array.from(this.products.values())
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }
  
  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }
  
  async getRecentBlogPosts(limit = 3): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }
  
  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  // Order methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const newOrder: Order = {
      ...order,
      id,
      status: "pending",
      createdAt: new Date()
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  // Contact methods
  async submitContactForm(contact: InsertContact): Promise<ContactSubmission> {
    const id = this.contactId++;
    const submission: ContactSubmission = {
      ...contact,
      id,
      createdAt: new Date()
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
}

export const storage = new MemStorage();
