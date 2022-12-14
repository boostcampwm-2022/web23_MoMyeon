import React, { PropsWithChildren } from "react";
import styles from "styles/BoxContainer.module.scss";

interface Shape {
  width: string;
  height: string;
  overflow?: boolean;
}
function BoxContainer({
  children,
  width,
  height,
  overflow,
}: PropsWithChildren & Shape) {
  return (
    <div
      className={styles.container}
      style={{
        width,
        height,
        overflowY: overflow ? "auto" : "hidden",
      }}
    >
      {children}
    </div>
  );
}

export default BoxContainer;
