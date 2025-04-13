import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/lib/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ProductFilterProps {
  onFilter: (filters: {
    search: string;
    category: string | null;
    isOrganic?: boolean;
    isNew?: boolean;
  }) => void;
  selectedCategory?: string;
  initialFilters?: {
    search: string;
    category: string;
    priceRange?: [number, number];
    rating?: number;
    isOrganic?: boolean;
    isNew?: boolean;
  };
}

export default function ProductFilter({ onFilter, selectedCategory, initialFilters }: ProductFilterProps) {
  const [search, setSearch] = useState(initialFilters?.search || "");
  const [category, setCategory] = useState(selectedCategory || "");
  const [isOrganic, setIsOrganic] = useState(initialFilters?.isOrganic || false);
  const [isNew, setIsNew] = useState(initialFilters?.isNew || false);

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
      isOrganic,
      isNew
    });
  }, [search, category, isOrganic, isNew, onFilter]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-neutral-100 hover:shadow-lg transition-shadow">
      <div className="mb-6">
        <Label className="text-base font-semibold mb-3 block text-neutral-800">Tìm kiếm</Label>
        <div className="relative">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-neutral-50 border-neutral-200 focus:border-primary hover:border-neutral-300 transition-colors"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        </div>
      </div>

      <div className="mb-6">
        <Label className="text-base font-semibold mb-4 block text-neutral-800">Danh mục sản phẩm</Label>
        <div className="space-y-3">
          <label className="flex items-center p-2 rounded-md hover:bg-neutral-50 transition-colors cursor-pointer group">
            <Checkbox
              id="all"
              checked={category === ""}
              onCheckedChange={() => setCategory("")}
              className="border-neutral-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="ml-2 text-sm text-neutral-700 group-hover:text-neutral-900">Tất cả sản phẩm</span>
          </label>
          
          {categories?.map((cat) => (
            <label key={cat.id} className="flex items-center p-2 rounded-md hover:bg-neutral-50 transition-colors cursor-pointer group">
              <Checkbox
                id={cat.slug}
                checked={category === cat.slug}
                onCheckedChange={() => setCategory(cat.slug)}
                className="border-neutral-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="ml-2 text-sm text-neutral-700 group-hover:text-neutral-900">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <Label className="text-base font-semibold mb-4 block text-neutral-800">Đặc điểm</Label>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="organic" className="text-sm text-neutral-700">Sản phẩm hữu cơ</label>
            <Switch 
              id="organic" 
              checked={isOrganic}
              onCheckedChange={setIsOrganic}
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="new" className="text-sm text-neutral-700">Sản phẩm mới</label>
            <Switch 
              id="new" 
              checked={isNew}
              onCheckedChange={setIsNew}
            />
          </div>
        </div>
      </div>
    </div>
  );
}