import React, { PropsWithChildren, ReactNode } from "react";
import Header from "components/header/header.component";
import styles from "styles/MyPageLayout.module.scss";
import MyPageHead from "head/myPageHead";

const MyPageLayout = ({
  pageTitle,
  children,
}: {
  pageTitle: string;
  children: PropsWithChildren<ReactNode>;
}) => {
  return (
    <div className={styles.layout}>
      <MyPageHead title={pageTitle} />
      <Header />
      {children}
    </div>
  );
};

export { MyPageLayout };
