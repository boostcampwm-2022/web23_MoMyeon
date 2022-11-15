import { Suspense, useState } from "react";
import styles from "styles/Home.module.scss";
import Header from "components/header/header.component";
import HomeHead from "head/home";
import PostContainer from "components/mainPost/postContainer.component";
import getPosts from "utils/api/getPosts";
import { Post, Posts } from "types/posts";
import { GetServerSideProps, NextPage } from "next";
import { Cookie } from "types/auth";

const Home: NextPage<Posts & Cookie> = ({ posts, cookie }) => {
  return (
    <div className={styles.main}>
      <HomeHead />
      <Header cookie={cookie} />
      <Suspense fallback={<div>로딩중</div>}>
        <PostContainer posts={posts} />
      </Suspense>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data: Post[] = await getPosts();
  const cookie = context.req.cookies.auth ? context.req.cookies.auth : null;
  return {
    props: {
      posts: data,
      cookie,
    },
  };
};

export default Home;
