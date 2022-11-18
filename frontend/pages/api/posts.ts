// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { data } from "mockData/postData";

type params = {
  params: { page: string };
};
export default function handler(
  req: NextApiRequest & params,
  res: NextApiResponse
) {
  let { page } = req.params;
  const pageInt = parseInt(page);
  const OFFSET = 10;
  const result = data.slice(pageInt * OFFSET, (pageInt + 1) * OFFSET);
  res.json(result);
  res.status(200).json(data);
}
