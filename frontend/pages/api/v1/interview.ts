import type { NextApiRequest, NextApiResponse } from "next";
import { data } from "mockData/postData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const post = req.body.data;
    data.unshift(post);
    res.status(201).json(post);
  }
}
