import styles from "styles/Home.module.scss";
import Header from "components/header/header.component";
import HomeHead from "head/home";
import getPosts from "utils/api/getPosts";
import { Posts } from "types/posts";
import { GetServerSideProps, NextPage } from "next";
import { Cookie } from "types/auth";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import PostContainer from "components/mainPost/postContainer.component";

const Home: NextPage<Posts & Cookie> = ({ cookie }) => {
  return (
    <div className={styles.main}>
      <HomeHead />
      <Header cookie={cookie} />
      <PostContainer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = context.req.cookies.auth ? context.req.cookies.auth : null;
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
      cookie,
    },
  };
};

export default Home;
