import React from "react";
import { NextPage } from "next";
import Header from "components/header/header.component";
import MyQuestion from "components/myquestion/myQuestion.component";

const Question: NextPage = () => {
  return (
    <>
      <Header />
      <MyQuestion />
    </>
  );
};

export default Question;
