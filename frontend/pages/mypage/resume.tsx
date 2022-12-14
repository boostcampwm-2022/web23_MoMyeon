import React from "react";
import { NextPage } from "next";
import MyResume from "components/myresume/myResume.component";
import { MyPageLayout } from "components/myPageLayout";
import Head from "next/head";

const Resume: NextPage = () => {
  return (
    <MyPageLayout pageTitle={"모면: 내 이력서"}>
      <MyResume />
    </MyPageLayout>
  );
};

export default Resume;
