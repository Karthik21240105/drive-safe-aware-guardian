
import { useEffect, useRef } from "react";
import { Product } from "@/types/ecommerce";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface RecommendationSectionProps {
  recommendations: Product[];
  onProductView: (id: number) => void;
  isLoading: boolean;
}

const RecommendationSection = ({ 
  recommendations, 
  onProductView, 
  isLoading 
}: RecommendationSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to start when recommendations change
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [recommendations]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recommended for You</h2>
        </div>
        <div className="flex overflow-hidden space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-none w-[200px] animate-pulse">
              <div className="h-[200px] bg-muted rounded-md mb-2" />
              <div className="h-4 bg-muted rounded-md mb-2 w-3/4" />
              <div className="h-4 bg-muted rounded-md w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recommended for You</h2>
        <p className="text-sm text-muted-foreground">Based on your browsing</p>
      </div>
      
      <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div 
            className="flex space-x-4" 
            ref={scrollContainerRef}
          >
            {recommendations.map((product) => (
              <Card 
                key={product.id} 
                className="flex-none w-[200px] hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onProductView(product.id)}
              >
                <CardContent className="p-4">
                  <AspectRatio ratio={1}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="rounded-md object-cover w-full h-full" 
                    />
                  </AspectRatio>
                  <div className="mt-2">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <p className="text-sm font-semibold">${product.price.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default RecommendationSection;
