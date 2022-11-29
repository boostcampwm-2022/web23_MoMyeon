import apiKeys from "constants/apiKeys";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/router";

const useGithubLoginQuery = (code: string | null) => {
  const router = useRouter();
  const request = useMutation(async (code: string | null) => {
    console.log(code);
    const rst = await axios.post(apiKeys.GITHUB_LOGIN_AUTH_REQUEST, { code });
    console.log(rst);
  });

  useEffect(() => {
    if (code !== null) {
      request.mutate(code);
    }
  }, []);

  useEffect(() => {
    const reload = async () => await router.replace("/");
    reload();
  }, [request.isSuccess]);

  /*
  useEffect(() => {
    const githubRequest = async () => {
      console.log(code);
      if (code === null) {
        return;
      }
      const request = await axios.post(apiKeys.GITHUB_LOGIN_AUTH_REQUEST, {
        code,
      });
      console.log(request);
    };
    githubRequest();
  }, []);*/
};

export { useGithubLoginQuery };
