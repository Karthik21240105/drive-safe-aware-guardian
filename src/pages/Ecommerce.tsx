
import { useState, useEffect } from "react";
import ProductList from "@/components/ecommerce/ProductList";
import RecommendationSection from "@/components/ecommerce/RecommendationSection";
import SearchBar from "@/components/ecommerce/SearchBar";
import CategoryFilter from "@/components/ecommerce/CategoryFilter";
import { Product } from "@/types/ecommerce";
import { fetchProducts, fetchRecommendations } from "@/lib/ecommerce-api";

const Ecommerce = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch initial products and recommendations
    setIsLoading(true);
    fetchProducts().then((data) => {
      setProducts(data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.map((product) => product.category))
      );
      setCategories(uniqueCategories);
      
      setIsLoading(false);
    });

    // Fetch initial recommendations
    fetchRecommendations().then((data) => {
      setRecommendations(data);
    });
  }, []);

  // Filter products based on search query and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleProductView = async (productId: number) => {
    console.log(`Viewing product: ${productId}`);
    // In a real app, this would send the event to the ML backend
    // and then fetch updated recommendations
    
    // Simulate getting new recommendations based on viewed product
    const newRecommendations = await fetchRecommendations(productId);
    setRecommendations(newRecommendations);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Smart Shop</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <SearchBar onSearch={handleSearch} />
            <div className="mt-4">
              <CategoryFilter 
                categories={categories} 
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Recommendations */}
          <RecommendationSection 
            recommendations={recommendations} 
            onProductView={handleProductView}
            isLoading={isLoading}
          />
          
          {/* Product Listings */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <ProductList 
              products={filteredProducts} 
              onProductView={handleProductView}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;
