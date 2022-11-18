import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { setCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;
  console.log(code);
  const request: any = await axios.post(
    "http://api.momeyon.site:8080/v1/auth/github",
    {
      code,
    }
  );
  const data = request.data;
  const { accessToken, refreshToken, nickname, profile } = data.userData;
  const cookieOption = {
    req,
    res,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 14,
  };
  setCookie("accessToken", accessToken, cookieOption);
  setCookie("refreshToken", refreshToken, cookieOption);
  setCookie("nickname", nickname, cookieOption);
  setCookie("profile", profile, cookieOption);
  res.redirect("/");
}
