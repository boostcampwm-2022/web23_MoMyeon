import { GetServerSideProps } from "next";
import { MyPageLayout } from "components/myPageLayout";
import { Feedback } from "components/feedback/feedback.component";
import styles from "styles/MyPageFeedback.module.scss";
import React from "react";
import Title from "../../../components/title";

const MyFeedbackPage = ({ id }: { id: string }) => {
  return (
    <MyPageLayout>
      <div className={styles.myPageFeedbackContainer}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>피드백 보기</span>
        </div>
        <Feedback roomName={id} isMyPage={true} />
      </div>
    </MyPageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id;

  return {
    props: {
      id,
    },
  };
};

export default MyFeedbackPage;
