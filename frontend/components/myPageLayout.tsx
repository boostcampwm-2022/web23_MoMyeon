import { PropsWithChildren, ReactNode } from "react";

const MyPageLayout = ({
  children,
}: {
  children: PropsWithChildren<ReactNode>;
}) => {
  return (
    <div style={{ minHeight: "100vh", padding: "4rem 0" }}>{children}</div>
  );
};

export { MyPageLayout };
