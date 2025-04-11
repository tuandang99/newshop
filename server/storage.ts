import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  cartItems, type CartItem, type InsertCartItem,
  type CartItemWithProduct
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewArrivals(): Promise<Product[]>;
  
  // Cart methods
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  getCartItem(sessionId: string, productId: number): Promise<CartItemWithProduct | undefined>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCartItemId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;

    // Seed with sample products
    this.seedProducts();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.name.toLowerCase().includes(lowercaseQuery) || 
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isFeatured
    );
  }

  async getNewArrivals(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isNew
    );
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );

    return items.map(item => {
      const product = this.products.get(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      return { ...item, product };
    });
  }

  async getCartItem(sessionId: string, productId: number): Promise<CartItemWithProduct | undefined> {
    const item = Array.from(this.cartItems.values()).find(
      (item) => item.sessionId === sessionId && item.productId === productId
    );

    if (!item) {
      return undefined;
    }

    const product = this.products.get(item.productId);
    if (!product) {
      return undefined;
    }

    return { ...item, product };
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if product exists
    const product = this.products.get(insertItem.productId);
    if (!product) {
      throw new Error(`Product with id ${insertItem.productId} not found`);
    }

    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.sessionId === insertItem.sessionId && item.productId === insertItem.productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += insertItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    } else {
      // Add new item
      const id = this.currentCartItemId++;
      const cartItem: CartItem = { ...insertItem, id };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) {
      return undefined;
    }

    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToRemove = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId)
      .map(item => item.id);
    
    itemsToRemove.forEach(id => this.cartItems.delete(id));
    
    return true;
  }

  // Seed products for the initial store setup
  private seedProducts() {
    const products: InsertProduct[] = [
      {
        name: "Wireless Headphones",
        description: "Premium wireless headphones with noise cancellation technology",
        price: 129.99,
        originalPrice: 159.99,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        category: "Electronics",
        isNew: false,
        isFeatured: true,
        rating: 4.5,
        reviewCount: 42,
        stock: 15
      },
      {
        name: "Smart Watch",
        description: "Feature-packed smartwatch with health monitoring and notifications",
        price: 249.99,
        originalPrice: 249.99,
        imageUrl: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08",
        category: "Electronics",
        isNew: false,
        isFeatured: true,
        rating: 5.0,
        reviewCount: 87,
        stock: 10
      },
      {
        name: "Running Shoes",
        description: "Lightweight and comfortable running shoes for professional athletes",
        price: 89.99,
        originalPrice: 119.99,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        category: "Sports",
        isNew: false,
        isFeatured: true,
        rating: 4.0,
        reviewCount: 29,
        stock: 25
      },
      {
        name: "Bluetooth Speaker",
        description: "Portable Bluetooth speaker with immersive sound quality",
        price: 79.99,
        originalPrice: 79.99,
        imageUrl: "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5",
        category: "Electronics",
        isNew: false,
        isFeatured: true,
        rating: 3.5,
        reviewCount: 18,
        stock: 12
      },
      {
        name: "Athletic Shoes",
        description: "High-performance athletic shoes for everyday use",
        price: 109.99,
        originalPrice: 109.99,
        imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
        category: "Sports",
        isNew: true,
        isFeatured: false,
        rating: 4.0,
        reviewCount: 12,
        stock: 8
      },
      {
        name: "Smartphone",
        description: "Latest model smartphone with advanced camera features",
        price: 699.99,
        originalPrice: 699.99,
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90",
        category: "Electronics",
        isNew: true,
        isFeatured: false,
        rating: 4.5,
        reviewCount: 8,
        stock: 5
      },
      {
        name: "Coffee Maker",
        description: "Programmable coffee maker for perfect brewing every time",
        price: 149.99,
        originalPrice: 149.99,
        imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26",
        category: "Home & Kitchen",
        isNew: true,
        isFeatured: false,
        rating: 5.0,
        reviewCount: 5,
        stock: 7
      },
      {
        name: "Travel Backpack",
        description: "Durable and spacious backpack perfect for travel and hiking",
        price: 59.99,
        originalPrice: 59.99,
        imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363",
        category: "Fashion",
        isNew: true,
        isFeatured: false,
        rating: 3.5,
        reviewCount: 9,
        stock: 20
      },
      {
        name: "Dress Shirt",
        description: "Formal dress shirt made from high-quality cotton",
        price: 45.99,
        originalPrice: 59.99,
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
        category: "Fashion",
        isNew: false,
        isFeatured: false,
        rating: 4.2,
        reviewCount: 15,
        stock: 30
      },
      {
        name: "Tablet",
        description: "Powerful tablet for work and entertainment",
        price: 399.99,
        originalPrice: 449.99,
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
        category: "Electronics",
        isNew: false,
        isFeatured: false,
        rating: 4.7,
        reviewCount: 23,
        stock: 6
      },
      {
        name: "Kitchen Knife Set",
        description: "Professional-grade kitchen knife set with block",
        price: 129.99,
        originalPrice: 169.99,
        imageUrl: "https://images.unsplash.com/photo-1593618998160-e34014e67546",
        category: "Home & Kitchen",
        isNew: false,
        isFeatured: false,
        rating: 4.8,
        reviewCount: 34,
        stock: 9
      },
      {
        name: "Yoga Mat",
        description: "Non-slip yoga mat with carrying strap",
        price: 29.99,
        originalPrice: 29.99,
        imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2",
        category: "Sports",
        isNew: false,
        isFeatured: false,
        rating: 4.3,
        reviewCount: 47,
        stock: 22
      }
    ];

    products.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id });
    });
  }
}

export const storage = new MemStorage();
