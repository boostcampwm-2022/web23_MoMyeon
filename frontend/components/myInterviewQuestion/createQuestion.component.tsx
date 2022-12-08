import React, { useRef, useEffect } from "react";
import styles from "styles/MypageInterview.module.scss";
import { useManageQuestionCreate } from "utils/hooks/useManageQuestion/useManageQuestionCreate";
import { questionTextValue } from "states/questionManage";
import { interviewUserValue } from "states/user";

function CreateQuestion({ roomId }: { roomId: string }) {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const { mutate } = useManageQuestionCreate();
  const textValue = questionTextValue();
  const cur = interviewUserValue();

  const onClickSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const text = textRef.current?.value;

    if (text) mutate({ content: text, roomId: parseInt(roomId), userId: cur });
    if (textRef.current) textRef.current.value = "";
  };

  useEffect(() => {
    if (textRef.current) textRef.current.focus();
  }, []);

  useEffect(() => {
    if (textRef.current) textRef.current.value = textValue;
  }, [textValue]);

  return (
    <div className={styles.createQuestion}>
      <form className={styles.formContainer}>
        <textarea ref={textRef} className={styles.textBox} autoFocus />
        <button onClick={onClickSubmit} className={styles.submitButton}>
          질문추가
        </button>
      </form>
    </div>
  );
}

export default CreateQuestion;
