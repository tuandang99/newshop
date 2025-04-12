
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/lib/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ProductFilterProps {
  onFilter: (filters: {
    search: string;
    category: string | null;
  }) => void;
  selectedCategory?: string;
  initialFilters?: {
    search: string;
    category: string;
  };
}

export default function ProductFilter({ onFilter, selectedCategory, initialFilters }: ProductFilterProps) {
  const [search, setSearch] = useState(initialFilters?.search || "");
  const [category, setCategory] = useState(selectedCategory || "");

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
    });
  }, [search, category, onFilter]);

  return (
    <div className="bg-white rounded-lg p-6 space-y-6 shadow-sm">
      <div>
        <Label className="text-sm font-medium mb-2 block">Tìm kiếm</Label>
        <div className="relative">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Danh mục sản phẩm</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all"
              checked={category === ""}
              onCheckedChange={() => setCategory("")}
            />
            <Label htmlFor="all" className="text-sm">Tất cả sản phẩm</Label>
          </div>
          
          {categories?.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2">
              <Checkbox
                id={cat.slug}
                checked={category === cat.slug}
                onCheckedChange={() => setCategory(cat.slug)}
              />
              <Label htmlFor={cat.slug} className="text-sm">{cat.name}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
