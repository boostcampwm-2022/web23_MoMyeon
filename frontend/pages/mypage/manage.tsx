import React from "react";
import { NextPage } from "next";
import MyManage from "components/myManage/myManage.component";
import { MyPageLayout } from "components/myPageLayout";
const Manage: NextPage = () => {
  return (
    <MyPageLayout>
      <MyManage />
    </MyPageLayout>
  );
};

export default Manage;
