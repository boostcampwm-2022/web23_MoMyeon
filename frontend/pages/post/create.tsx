import styles from "styles/Create.module.scss";
import Header from "components/header/header.component";
import React, { useEffect } from "react";
import CreatePostForm from "components/createPostForm/createPostForm.component";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import { useUserDataQuery } from "../../utils/hooks/useUserDataQuery";
import { useRouter } from "next/router";

const Create: NextPage = () => {
  const { isLoading, isError } = useUserDataQuery();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isError) {
      const prevent = async () => {
        await router.push("/");
      };

      prevent();
    }
  }, [isError]);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className={styles.createPageContainer}>
      <Header />
      <Head>
        <title>모두의 면접</title>
      </Head>
      <div className={styles.createContainer}>
        <div className={styles.titleWrapper}>
          <h2> 모의 면접 모집 </h2>
        </div>
        <CreatePostForm />
      </div>
    </div>
  );
};

/*
export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessToken = context.req.cookies.accessToken ?? null;
  if (!accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      accessToken,
    },
  };
};*/

export default Create;
