import type { NextApiRequest, NextApiResponse } from "next";
import { categoryData } from "mockData/categoryData";
export interface Category {
  id: number;
  name: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Category[]>
) {
  res.status(200).json(categoryData);
}
