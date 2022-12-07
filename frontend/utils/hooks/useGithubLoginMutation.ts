import { useMutation } from "@tanstack/react-query";
import githubLogin from "utils/api/githubLogin";
import Cookies from "js-cookie";

const useGithubLoginMutation = (code: string | null) => {
  return useMutation(async (code: string | null) => {
    const rst = await githubLogin(code);

    if (rst.data?.accessToken) {	 
      Cookies.set("accessToken", rst.data.accessToken, {
        secure: true,
        sameSite: 'None',
        expires: 1,
      });
    }

    if (rst.data.refreshToken) {
      Cookies.set("refreshToken", rst.data.refreshToken, {
        secure: true,
        sameSite: 'None',
        expires: 1,
      });
    }
  });
};

export { useGithubLoginMutation };

