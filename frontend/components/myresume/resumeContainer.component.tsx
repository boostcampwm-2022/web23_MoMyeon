import React, { useEffect } from "react";
import { ResumeContainerProps } from "./resume";
import styles from "styles/MypageResume.module.scss";
import ResumeItem from "./resumeItem.component";
import { resumeState } from "states/resume";
function ResumeContainer({ itemId, item, content }: ResumeContainerProps) {
  const [resume, setResume] = resumeState();

  const onClickAdd = () => {
    setResume({ id: itemId, item });
  };
  useEffect(() => {
    if (resume.id) {
      window.scroll({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [resume]);
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
