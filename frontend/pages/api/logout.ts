import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { setCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieOption = {
    req,
    res,
    httpOnly: true,
    maxAge: -1,
  };
  setCookie("accessToken", "", cookieOption);
  setCookie("refreshToken", "", cookieOption);
  setCookie("nickname", "", cookieOption);
  setCookie("profile", "", cookieOption);
  res.redirect("/");
}
