import React, { useRef } from "react";
import styles from "styles/MypageResume.module.scss";
import { resumeState } from "states/resume";
import { useMyResumeCreate } from "utils/hooks/useMyResume/useMyResumeCreate";
function ResumeCreate() {
  const [resume, setResume] = resumeState();
  const { item, id } = resume;
  const { mutate } = useMyResumeCreate();
  const textRef = useRef<null | HTMLTextAreaElement>(null);

  const onClickCreate = () => {
    const text = textRef.current?.value;
    if (textRef.current && id && text) {
      mutate({ content: text, item: id.toString() });
      textRef.current.value = "";
    }
  };
  return (
    <div className={styles.createContainer}>
      <span className={styles.resumeTitle}>{item}</span>
      <textarea ref={textRef} className={styles.resumeInput} />
      <button onClick={onClickCreate} className={styles.createButton}>
        저장
      </button>
    </div>
  );
}

export default ResumeCreate;
