import React from "react";
import styles from "styles/Title.module.scss";

function Title({ text }: { text: string }) {
  return (
    <div className={styles.textContainer}>
      <span className={styles.text}>{text}</span>
    </div>
  );
}

export default Title;
