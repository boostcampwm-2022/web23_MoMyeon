import styles from "styles/Home.module.scss";
import Header from "components/header/header.component";
import HomeHead from "head/home";
import getPosts from "utils/api/getPosts";
import getAllCategory from "utils/api/getAllCategory";
import PostContainer from "components/mainPost/postContainer.component";
import CategoryContainer from "components/mainFilter/categoryContainer.component";

import { Posts } from "types/posts";
import { GetServerSideProps, NextPage } from "next";
import { UserDataProps } from "types/auth";
import { CategoryProps } from "types/category";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { userDataRecoil } from "states/user";
const Home: NextPage<UserDataProps & CategoryProps> = ({
  userData,
  category,
}) => {
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
      <CategoryContainer category={category} />
      <PostContainer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const nickname = context.req.cookies.nickname ?? null;
  const profile = context.req.cookies.profile ?? null;

  const userData = { profile, nickname };
  const queryClient = new QueryClient();
  const [_, category] = await Promise.allSettled([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["posts", []],
      queryFn: () => getPosts({ pageParam: 0, category: [], search: "" }),
    }),
    getAllCategory(),
  ]);
  const hydrate: any = dehydrate(queryClient);
  if (hydrate.queries[0]) {
    hydrate.queries[0].state.data.pageParams[0] = 0;
  }
  const value =
    category.status === "fulfilled"
      ? category.value
      : { id: -1, name: "잘못된응답", subjecj: "잘못된응답" };
  return {
    props: {
      dehydratedState: hydrate,
      userData,
      category: value,
    },
  };
};

export default Home;
