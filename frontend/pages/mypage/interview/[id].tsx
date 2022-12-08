import React from "react";
import { GetServerSideProps } from "next";
import Header from "components/header/header.component";
import InterviewUser from "components/interviewUser/interviewUser.component";
import QuestionContainer from "components/myInterviewQuestion/QuestionContainer.component";
import styles from "styles/MypageInterview.module.scss";
import CreateQuestion from "components/myInterviewQuestion/createQuestion.component";
import MyQuestion from "components/myInterviewQuestion/myQuestion.component";
function Interview({ id }: { id: string }) {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <InterviewUser id={id} />
        <div className={styles.rowContainer}>
          <QuestionContainer id={id} />
          <MyQuestion />
        </div>
        <CreateQuestion roomId={id} />
      </div>
    </>
  );
}

export default Interview;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id;

  return {
    props: {
      id,
    },
  };
};
