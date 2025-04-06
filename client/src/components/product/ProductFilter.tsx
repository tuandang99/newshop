
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface ProductFilterProps {
  onFilter: (filters: {
    search: string;
    minPrice: number;
    maxPrice: number;
    minRating: number;
  }) => void;
}

export default function ProductFilter({ onFilter }: ProductFilterProps) {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [rating, setRating] = useState(0);

  const handleFilter = () => {
    onFilter({
      search,
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
