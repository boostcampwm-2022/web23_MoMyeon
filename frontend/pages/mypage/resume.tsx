import React from "react";
import { NextPage } from "next";
import MyResume from "components/myresume/myResume.component";
import { MyPageLayout } from "components/myPageLayout";

const Resume: NextPage = () => {
  return (
    <MyPageLayout>
      <MyResume />
    </MyPageLayout>
  );
};

export default Resume;
