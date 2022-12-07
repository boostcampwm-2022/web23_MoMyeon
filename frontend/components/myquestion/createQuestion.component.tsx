import React, { useRef, useEffect } from "react";
import styles from "styles/MypageQuestion.module.scss";
import { useMyQuestionCreate } from "utils/hooks/useMyQuestionCreate";
function CreateQuestion() {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const { mutate, error } = useMyQuestionCreate();
  useEffect(() => {
    if (textRef.current) textRef.current.focus();
  }, []);
  const onClickSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const text = textRef.current?.value;
    if (text) mutate({ content: text });
    if (textRef.current) textRef.current.value = "";
  };
  return (
    <form className={styles.formContainer}>
      <textarea ref={textRef} className={styles.textBox} autoFocus />
      <button onClick={onClickSubmit} className={styles.submitButton}>
        질문추가
      </button>
    </form>
  );
}

export default CreateQuestion;
