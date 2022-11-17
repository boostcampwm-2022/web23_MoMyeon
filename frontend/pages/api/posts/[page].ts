// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { data } from "mockData/postData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let { page } = req.query;
  const pageInt = parseInt(page as string);
  const OFFSET = 10;
  const result = data.slice(pageInt * OFFSET, (pageInt + 1) * OFFSET);
  res.status(200).json(result);
}
