
import { useState } from "react";
import { Product } from "@/types/ecommerce";
import ProductCard from "@/components/ecommerce/ProductCard";
import { Grid2X2, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductListProps {
  products: Product[];
  onProductView: (id: number) => void;
  isLoading: boolean;
}

const ProductList = ({ products, onProductView, isLoading }: ProductListProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card rounded-lg p-4 shadow-sm animate-pulse">
            <div className="h-48 bg-muted rounded-md mb-4" />
            <div className="h-4 bg-muted rounded-md mb-2 w-3/4" />
            <div className="h-4 bg-muted rounded-md mb-2 w-1/2" />
            <div className="h-4 bg-muted rounded-md w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center py-8">No products found matching your criteria</div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={viewMode === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            viewMode={viewMode}
            onView={() => onProductView(product.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
