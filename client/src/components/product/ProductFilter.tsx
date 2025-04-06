import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
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
  };
}

export default function ProductFilter({ onFilter, selectedCategory, initialFilters }: ProductFilterProps) {
  const [search, setSearch] = useState(initialFilters?.search || "");
  const [category, setCategory] = useState(selectedCategory || initialFilters?.category || "");

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
      category: category === "" ? null : category,
      minPrice: 0,
      maxPrice: 1000000,
      minRating: 0
    };
    console.log('Applying filters:', {
      ...filters,
      categoryDetails: categories?.find(cat => cat.slug === category)
    });
    onFilter(filters);
  };

  useEffect(() => {
    console.log("Filtering with category:", category);
    handleFilter();
  }, [search, category]);

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
    </div>
  );
}