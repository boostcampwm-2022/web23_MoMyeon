import styles from "styles/Home.module.scss";
import Header from "components/header/header.component";
import HomeHead from "head/home";
import getPosts from "utils/api/getPosts";
import PostContainer from "components/mainPost/postContainer.component";

import { Posts } from "types/posts";
import { GetServerSideProps, NextPage } from "next";
import { UserDataProps } from "types/auth";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { userDataRecoil } from "states/user";

const Home: NextPage<UserDataProps> = ({ userData }) => {
  const setUser = useSetRecoilState(userDataRecoil);

  useEffect(() => {
    if (userData && userData.nickname) {
      setUser(userData);
    }
  }, [setUser, userData]);
  return (
    <div className={styles.main}>
      <HomeHead />
      <Header />
      <PostContainer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const nickname = context.req.cookies.nickname ?? null;
  const profile = context.req.cookies.profile ?? null;

  const userData = { profile, nickname };
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
      userData,
    },
  };
};

export default Home;
