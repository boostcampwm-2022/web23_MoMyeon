import { useMutation } from "@tanstack/react-query";
import githubLogin from "utils/api/githubLogin";

const useGithubLoginMutation = () => {
  return useMutation(async (code: string | null) => {
    const rst = await githubLogin(code);
  });
};

export { useGithubLoginMutation };
