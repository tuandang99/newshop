
import { useState } from "react";
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
}

export default function ProductFilter({ onFilter, selectedCategory }: ProductFilterProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(selectedCategory || "");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [rating, setRating] = useState(0);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleFilter = () => {
    onFilter({
      search,
      category: category || null,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating: rating
    });
  };

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
          onValueChange={setPriceRange}
        />
        <div className="flex justify-between text-sm mt-1">
          <span>{priceRange[0].toLocaleString()}₫</span>
          <span>{priceRange[1].toLocaleString()}₫</span>
        </div>
      </div>

      <Button onClick={handleFilter} className="w-full">
        Lọc sản phẩm
      </Button>
    </div>
  );
}
