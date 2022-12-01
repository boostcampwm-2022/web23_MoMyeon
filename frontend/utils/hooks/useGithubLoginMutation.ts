import { useMutation } from "@tanstack/react-query";
import githubLogin from "utils/api/githubLogin";
const useGithubLoginMutation = (code: string | null) => {
  return useMutation(async (code: string | null) => {
    const rst = await githubLogin(code);
    console.log(rst);
  });
};

export { useGithubLoginMutation };
