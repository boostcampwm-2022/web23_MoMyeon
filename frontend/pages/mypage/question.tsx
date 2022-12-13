import React from "react";
import { NextPage } from "next";
import Header from "components/header/header.component";
import MyQuestion from "components/myquestion/myQuestion.component";
import { MyPageLayout } from "components/myPageLayout";

const Question: NextPage = () => {
  return (
    <MyPageLayout>
      <Header />
      <MyQuestion />
    </MyPageLayout>
  );
};

export default Question;
