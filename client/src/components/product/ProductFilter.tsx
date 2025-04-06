
import { useState, useEffect } from "react";
import { Category } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/lib/icons";

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
    search: string;
    category: string;
    priceRange: [number, number];
    rating: number;
  };
}

export default function ProductFilter({ onFilter, selectedCategory, initialFilters }: ProductFilterProps) {
  const [search, setSearch] = useState(initialFilters?.search || "");
  const [category, setCategory] = useState(selectedCategory || "");
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

  useEffect(() => {
    onFilter({
      search: search.trim(),
      category: category || null,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating: rating
    });
  }, [search, category, priceRange, rating, onFilter]);

  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        <div>
          <label className="text-sm font-medium">Danh mục sản phẩm</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
          <label className="text-sm font-medium">Giá (VNĐ)</label>
          <div className="flex gap-2 mt-1">
            <Input
              type="number"
              placeholder="Từ"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              min={0}
            />
            <Input
              type="number"
              placeholder="Đến"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              min={priceRange[0]}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Đánh giá tối thiểu</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="0">Tất cả</option>
            <option value="3">3 sao trở lên</option>
            <option value="4">4 sao trở lên</option>
            <option value="5">5 sao</option>
          </select>
        </div>
      </div>
    </div>
  );
}
