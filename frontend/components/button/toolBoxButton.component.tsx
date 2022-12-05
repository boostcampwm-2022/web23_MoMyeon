import styles from "styles/room.module.scss";
import React from "react";

const ToolBoxButton = ({children} : {children: JSX.Element[]}) => {
  return (
    <div className = {styles.toolContainer}>
      <div className={styles.toolBox}>
        {children}
      </div>
    </div>
  );
}


export { ToolBoxButton }