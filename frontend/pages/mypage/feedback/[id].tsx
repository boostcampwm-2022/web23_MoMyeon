import { GetServerSideProps } from "next";
import { MyPageLayout } from "components/myPageLayout";
import { Feedback } from "components/feedback/feedback.component";
import React from "react";

const MyFeedbackPage = ({ id }: { id: string }) => {
  return (
    <MyPageLayout>
      <Feedback roomName={id} />
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
