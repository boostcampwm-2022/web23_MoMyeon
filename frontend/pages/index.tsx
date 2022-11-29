import styles from "styles/Home.module.scss";
import Header from "components/header/header.component";
import HomeHead from "head/home";
import getPosts from "utils/api/getPosts";
import PostContainer from "components/mainPost/postContainer.component";
import { GetServerSideProps, NextPage } from "next";
import { GithubCodeProps, UserDataProps } from "types/auth";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { useGithubLoginMutation } from "../utils/hooks/useGithubLoginMutation";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage<GithubCodeProps> = ({ code }) => {
  const mutation = useGithubLoginMutation(code);
  const router = useRouter();

  useEffect(() => {
    if (code !== null) {
      mutation.mutate(code);
    }
  }, []);

  useEffect(() => {
    const reload = async () => {
      await router.replace("/");
    };
    reload();
  }, [mutation.isSuccess]);

  return (
    <div className={styles.main}>
      <HomeHead />
      <Header />
      {/*<PostContainer> */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.query.code ?? null;

  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const hydrate: any = dehydrate(queryClient);
  if (hydrate.queries[0]) hydrate.queries[0].state.data.pageParams[0] = 0;
  return {
    props: {
      dehydratedState: hydrate,
      code: code,
    },
  };
};

export default Home;
