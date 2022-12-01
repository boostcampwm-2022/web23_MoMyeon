export interface Category {
  id: number;
  name: string;
  subject: string;
}

export interface CategoryProps {
  category: CategoryTable;
}

export interface CategoryTable {
  [key: string]: Category[];
}

export interface CategoryParentProps {
  categoryKey: string[];
}