
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";

interface ProductFilterProps {
  onFilter: (filters: {
    search: string;
    category: string | null;
    minPrice: number;
    maxPrice: number;
    minRating: number;
  }) => void;
  selectedCategory?: string;
  initialFilters?: {
    search?: string;
    category?: string;
    priceRange?: [number, number];
    rating?: number;
  };
}

export default function ProductFilter({ onFilter, selectedCategory, initialFilters }: ProductFilterProps) {
  const [search, setSearch] = useState(initialFilters?.search || "");
  const [category, setCategory] = useState(selectedCategory || initialFilters?.category || "");
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters?.priceRange || [0, 1000000]);
  const [rating, setRating] = useState(initialFilters?.rating || 0);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleFilter = () => {
    const filters = {
      search: search.trim(),
      category: category || null,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating: rating
    };
    console.log('Applying filters:', filters);
    onFilter(filters);
  };

  // Auto-apply filters when inputs change
  useEffect(() => {
    handleFilter();
  }, [search, category, priceRange, rating]);

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <Input
        placeholder="Tìm kiếm sản phẩm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <div>
        <label className="text-sm font-medium">Danh mục</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-md"
        >
          <option value="">Tất cả danh mục</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Khoảng giá</label>
        <Slider
          min={0}
          max={1000000}
          step={50000}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
        />
        <div className="flex justify-between text-sm mt-1">
          <span>{priceRange[0].toLocaleString()}₫</span>
          <span>{priceRange[1].toLocaleString()}₫</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Đánh giá tối thiểu</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full"
          />
          <span>{rating} ⭐</span>
        </div>
      </div>
    </div>
  );
}
