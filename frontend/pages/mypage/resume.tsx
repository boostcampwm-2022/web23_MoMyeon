import React from "react";
import { NextPage } from "next";
import Header from "components/header/header.component";
import MyResume from "components/myresume/myResume.component";

const Resume: NextPage = () => {
  return (
    <>
      <Header />
      <MyResume />
    </>
  );
};

export default Resume;
