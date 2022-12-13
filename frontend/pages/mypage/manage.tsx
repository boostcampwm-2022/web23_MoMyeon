import React from "react";
import { NextPage } from "next";
import Header from "components/header/header.component";
import MyManage from "components/myManage/myManage.component";
import { MyPageLayout } from "components/myPageLayout";
const Manage: NextPage = () => {
  return (
    <MyPageLayout>
      <Header />
      <MyManage />
    </MyPageLayout>
  );
};

export default Manage;
