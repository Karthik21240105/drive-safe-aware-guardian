import { Product } from "@/types/ecommerce";

// Mock data for products
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    description: "Premium wireless noise cancelling headphones with hi-res audio and adaptive sound control",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    category: "Electronics",
    rating: 4.7,
    inStock: true,
    features: ["40h battery life", "Noise cancellation", "Touch controls"]
  },
  {
    id: 2,
    name: "Ultralight Trail Running Shoes",
    description: "Lightweight, responsive trail running shoes with exceptional grip and durability",
    price: 129.95,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    category: "Sports",
    rating: 4.5,
    inStock: true,
    features: ["Vibram outsole", "Gore-tex waterproofing", "Quick-lace system"]
  },
  {
    id: 3,
    name: "Smart Home Hub",
    description: "Control all your smart home devices with this centralized hub featuring voice control",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc0d4",
    category: "Electronics",
    rating: 4.3,
    inStock: true,
    features: ["Voice control", "Multi-device support", "Easy setup"]
  },
  {
    id: 4,
    name: "Organic Cotton T-shirt",
    description: "Comfortable and sustainable organic cotton t-shirt, perfect for everyday wear",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    category: "Clothing",
    rating: 4.8,
    inStock: true,
    features: ["100% organic cotton", "Sustainable production", "Multiple colors"]
  },
  {
    id: 5,
    name: "Ultra HD 4K Smart TV",
    description: "Experience stunning picture quality with this 55-inch 4K smart TV with HDR",
    price: 699.99,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
    category: "Electronics",
    rating: 4.6,
    inStock: false,
    features: ["4K resolution", "Smart functionality", "Multiple HDMI ports"]
  },
  {
    id: 6,
    name: "Professional Blender",
    description: "High-performance blender perfect for smoothies, soups, and more",
    price: 249.95,
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b",
    category: "Kitchen",
    rating: 4.9,
    inStock: true,
    features: ["1200W motor", "Multiple speed settings", "Dishwasher safe"]
  },
  {
    id: 7,
    name: "Leather Wallet",
    description: "Handcrafted genuine leather wallet with RFID blocking technology",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
    category: "Accessories",
    rating: 4.4,
    inStock: true,
    features: ["Genuine leather", "RFID protection", "Multiple card slots"]
  },
  {
    id: 8,
    name: "Yoga Mat",
    description: "Eco-friendly non-slip yoga mat perfect for all types of yoga practice",
    price: 75.00,
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2",
    category: "Sports",
    rating: 4.7,
    inStock: true,
    features: ["Eco-friendly material", "Non-slip surface", "Lightweight design"]
  },
  {
    id: 9,
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe to keep coffee hot for hours",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1520970519539-8cb37f546e4e",
    category: "Kitchen",
    rating: 4.2,
    inStock: true,
    features: ["24-hour programmability", "Thermal carafe", "Auto shut-off"]
  },
  {
    id: 10,
    name: "E-Reader",
    description: "Waterproof e-reader with glare-free display and weeks of battery life",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
    category: "Electronics",
    rating: 4.5,
    inStock: true,
    features: ["Waterproof", "Built-in light", "Weeks of battery"]
  },
  {
    id: 11,
    name: "Stainless Steel Water Bottle",
    description: "Double-walled insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours",
    price: 34.95,
    image: "https://images.unsplash.com/photo-1616118132534-731551be29f9",
    category: "Accessories",
    rating: 4.8,
    inStock: true,
    features: ["Double-wall insulation", "BPA-free", "Leak-proof cap"]
  },
  {
    id: 12,
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1623126908029-58cb08a2b272",
    category: "Electronics",
    rating: 4.3,
    inStock: true,
    features: ["Fast charging", "LED indicator", "Slim design"]
  }
];

// Simulate API calls with a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  // Simulate network delay
  await delay(800);
  return mockProducts;
};

// Fetch recommendations based on a product ID or default recommendations
export const fetchRecommendations = async (productId?: number): Promise<Product[]> => {
  // Simulate network delay
  await delay(600);
  
  if (productId) {
    // Get the selected product
    const selectedProduct = mockProducts.find(p => p.id === productId);
    
    if (selectedProduct) {
      // Get other products in the same category
      const sameCategory = mockProducts.filter(
        p => p.category === selectedProduct.category && p.id !== selectedProduct.id
      );
      
      // If we have enough products in the same category, return those
      if (sameCategory.length >= 4) {
        return sameCategory.slice(0, 4);
      }
      
      // Otherwise get some random products to fill up to 4 recommendations
      const otherProducts = mockProducts
        .filter(p => p.id !== selectedProduct.id && !sameCategory.includes(p))
        .sort(() => 0.5 - Math.random());
      
      return [...sameCategory, ...otherProducts].slice(0, 4);
    }
  }
  
  // Default recommendations (random selection)
  return mockProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
};

// Simulate ML-based recommendation endpoint
// In a real system, this would call a Python/ML backend
export const getMlRecommendations = async (
  userId: string, 
  viewHistory: number[]
): Promise<Product[]> => {
  // Simulate network delay
  await delay(1000);
  
  console.log(`Getting ML recommendations for user ${userId} with view history:`, viewHistory);
  
  // For the demo, just return random products
  // In a real system, this would call a Python ML model through an API
  return mockProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
};
