
import { Product } from "@/types/ecommerce";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, StarHalf, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
  onView: () => void;
}

const ProductCard = ({ product, viewMode, onView }: ProductCardProps) => {
  const { name, price, image, rating, description, category } = product;

  // Generate stars for rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    return stars;
  };

  if (viewMode === "list") {
    return (
      <Card onClick={onView} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 p-4">
            <AspectRatio ratio={1}>
              <img src={image} alt={name} className="rounded-md object-cover w-full h-full" />
            </AspectRatio>
          </div>
          <div className="md:w-3/4 p-4">
            <div className="text-sm text-muted-foreground mb-1">{category}</div>
            <h3 className="text-lg font-medium">{name}</h3>
            <div className="flex items-center mt-1">
              {renderStars(rating)}
              <span className="text-sm text-muted-foreground ml-2">{rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>
            <div className="flex items-center justify-between mt-4">
              <div className="text-lg font-semibold">${price.toFixed(2)}</div>
              <Button size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card onClick={onView} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div className="p-4">
        <AspectRatio ratio={1}>
          <img src={image} alt={name} className="rounded-md object-cover w-full h-full" />
        </AspectRatio>
      </div>
      <CardContent className="pt-0">
        <div className="text-sm text-muted-foreground mb-1">{category}</div>
        <h3 className="font-medium line-clamp-1">{name}</h3>
        <div className="flex items-center mt-1">
          {renderStars(rating)}
          <span className="text-sm text-muted-foreground ml-2">{rating.toFixed(1)}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <div className="text-lg font-semibold">${price.toFixed(2)}</div>
        <Button size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
