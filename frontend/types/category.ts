export interface Category {
  id: number;
  name: string;
  subjecj: string;
}

export interface CategoryProps {
  category : Category[]
}

export interface CategoryTable {
  [key:string] : Category[]
}