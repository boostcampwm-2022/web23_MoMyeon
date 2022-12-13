import React from "react";
import { NextPage } from "next";
import Header from "components/header/header.component";
import MyResume from "components/myresume/myResume.component";
import { MyPageLayout } from "components/myPageLayout";

const Resume: NextPage = () => {
  return (
    <MyPageLayout>
      <Header />
      <MyResume />
    </MyPageLayout>
  );
};

export default Resume;
