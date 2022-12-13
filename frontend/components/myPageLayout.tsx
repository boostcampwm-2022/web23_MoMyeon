import { PropsWithChildren, ReactNode } from "react";
import Header from "components/header/header.component";
import styles from "styles/myPageLayout.module.scss";

const MyPageLayout = ({
  children,
}: {
  children: PropsWithChildren<ReactNode>;
}) => {
  return (
    <div className={styles.layout}>
      <Header />
      {children}
    </div>
  );
};

export { MyPageLayout };
