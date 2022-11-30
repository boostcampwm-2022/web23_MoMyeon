import apiKeys from "constants/apiKeys";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useGithubLoginMutation = (code: string | null) => {
  return useMutation(async (code: string | null) => {
    const rst = await axios.post(
      apiKeys.GITHUB_LOGIN_AUTH_REQUEST,
      { code },
      { withCredentials: true }
    );
    console.log(rst);
  });
};

export { useGithubLoginMutation };
