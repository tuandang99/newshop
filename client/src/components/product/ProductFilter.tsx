
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { SearchIcon, FilterIcon } from "@/lib/icons";

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

  useEffect(() => {
    handleFilter();
  }, [search, category, priceRange, rating]);

  return (
    <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FilterIcon className="w-5 h-5" />
          Bộ lọc sản phẩm
        </h3>
        
        <div className="relative mb-4">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="p-4">
        <label className="text-sm font-medium block mb-2">Danh mục</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        >
          <option value="">Tất cả danh mục</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4">
        <label className="text-sm font-medium block mb-3">Khoảng giá</label>
        <Slider
          min={0}
          max={1000000}
          step={50000}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{priceRange[0].toLocaleString()}₫</span>
          <span>{priceRange[1].toLocaleString()}₫</span>
        </div>
      </div>

      <div className="p-4">
        <label className="text-sm font-medium block mb-2">Đánh giá tối thiểu</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <span className="text-sm font-medium min-w-[60px]">{rating} ⭐</span>
        </div>
      </div>
    </div>
  );
}
