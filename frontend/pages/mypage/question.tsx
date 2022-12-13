import React from "react";
import { NextPage } from "next";
import MyQuestion from "components/myquestion/myQuestion.component";
import { MyPageLayout } from "components/myPageLayout";

const Question: NextPage = () => {
  return (
    <MyPageLayout>
      <MyQuestion />
    </MyPageLayout>
  );
};

export default Question;
