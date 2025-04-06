import { useState, useEffect } from "react";
import { Category } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/lib/icons";

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
      </div>
    </div>
  );
}