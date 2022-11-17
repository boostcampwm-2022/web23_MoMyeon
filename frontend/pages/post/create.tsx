import styles from "styles/Create.module.scss";
import Header from "components/header/header.component";
import React from "react";
import CreatePostForm from "components/createPostForm/createPostForm.component";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import {Cookie} from "types/auth";

const Create: NextPage<Cookie> = ({ cookie }) => {
  return (
    <div className={styles.createPageContainer}>
      <Header cookie={cookie} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = context.req.cookies.auth ? context.req.cookies.auth : null;
  if(!cookie){
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      cookie,
    },
  };
};

export default Create;
