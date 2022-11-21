import type { NextApiRequest, NextApiResponse } from "next";
import { categoryData } from "mockData/categoryData";
import { Category } from "types/category";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Category[]>
) {
  res.status(200).json(categoryData);
}
