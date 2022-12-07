import React, { Suspense, useState } from "react";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import styles from "styles/Resume.module.scss";
import InterviewUser from "components/interviewUser/interviewUser.component";

const QAContainer = dynamic(
  () => import("components/question/qaContainer.component"),
  {
    ssr: false,
  }
);
const Resume = dynamic(() => import("components/resume/resume.component"), {
  ssr: false,
});
const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      로딩중
    </div>
  );
};
function TempQuestion({ postId }: { postId: string }) {
  return (
    <>
      <InterviewUser id={postId} />
      <div className={styles.container}>
        <Suspense fallback={<Loading />}>
          <Resume id={postId} />
        </Suspense>
      </div>
      <div className={styles.container}>
        <Suspense fallback={<Loading />}>
          <QAContainer id={postId} />
        </Suspense>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postId = context.query.id;
  return {
    props: {
      postId,
    },
  };
};

export default TempQuestion;
