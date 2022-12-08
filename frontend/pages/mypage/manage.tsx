import React from "react";
import { NextPage } from "next";
import Header from "components/header/header.component";
import MyManage from "components/myManage/myManage.component";
const Manage: NextPage = () => {
  return (
    <>
      <Header />
      <MyManage />
    </>
  );
};

export default Manage;
