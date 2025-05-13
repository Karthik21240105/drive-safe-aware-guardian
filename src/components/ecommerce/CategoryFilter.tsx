
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 text-sm rounded-full border ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-background"
          }`}
          onClick={() => onCategoryChange("all")}
        >
          All
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            className={`px-3 py-1 text-sm rounded-full border ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-background"
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
