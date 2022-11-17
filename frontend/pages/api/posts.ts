// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { data } from 'mockData/postData'
import {Post} from "types/posts";


const data = [
  {
    title: "네이버 1차",
    hashtag: ["네트워크", "운영체제"],
    user: "hyodori",
    view: 300,
  },
  {
    title: "카카오 1차",
    hashtag: ["네트워크", "운영체제"],
    user: "hyodori",
    view: 300,
  },
  {
    title: "라인 1차",
    hashtag: ["네트워크", "운영체제"],
    user: "hyodori",
    view: 300,
  },
  {
    title: "쿠팡 1차",
    hashtag: ["네트워크", "운영체제"],
    user: "hyodori",
    view: 300,
  },
  {
    title: "배민 1차",
    hashtag: ["네트워크", "운영체제"],
    user: "hyodori",
    view: 300,
  },
  {
    title: "토스 1차",
    hashtag: ["네트워크", "운영체제"],
    user: "hyodori",
    view: 300,
  },
  {
    title: "당근 1차",
    hashtag: ["네트워크", "운영체제"],
    user: "hyodori",
    view: 300,
  },
  {
    title: "직방 1차",
    hashtag: ["네트워크", "운영체제"],
    user: "hyodori",
    view: 300,
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(data);
}
