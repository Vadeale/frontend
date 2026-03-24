import type { JobCategory } from '../types';

interface CategoryTabsProps {
  categories: { label: string; value: JobCategory }[];
  selected: JobCategory;
  onSelect: (value: JobCategory) => void;
}

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="categories-scroll">
      {categories.map((item) => (
        <button
          key={item.value}
          type="button"
          className={`category ${item.value === selected ? 'active' : ''}`}
          onClick={() => onSelect(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
