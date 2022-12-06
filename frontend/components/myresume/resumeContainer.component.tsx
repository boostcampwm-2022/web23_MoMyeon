import React from "react";
import { ResumeContainerProps } from "./resume";
import styles from "styles/MypageResume.module.scss";
import ResumeItem from "./resumeItem.component";
import { resumeSet } from "states/resume";
function ResumeContainer({ itemId, item, content }: ResumeContainerProps) {
  const setResume = resumeSet();

  const onClickAdd = () => {
    setResume({ id: itemId, item });
    window.scroll({ top: document.body.scrollHeight, behavior: "smooth" });
  };
  return (
    <div className={styles.resumeContainer}>
      <div className={styles.resumeTitle}>{item}</div>
      <button onClick={onClickAdd} className={styles.addButton}>
        항목추가
      </button>
      <div className={styles.scrollY}>
        {content?.map((item) => {
          const { id } = item;
          return <ResumeItem key={id} data={item} />;
        })}
      </div>
    </div>
  );
}

export default ResumeContainer;
