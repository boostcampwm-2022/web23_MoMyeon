import React from "react";
import styles from "styles/Question.module.scss";
import question from "public/icon/question.png";
import Image from "next/image";

interface QuestionProp {
  id: number;
  contents: string;
  focus: boolean;
  setFocus: Function;
}
function Question({ id, contents, focus, setFocus }: QuestionProp) {
  const onClickText = () => {
    setFocus(!focus);
  };
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <Image src={question} width={35} height={35} alt={"question-mark"} />
      </div>
      <div
        onClick={onClickText}
        className={`${styles.text} ${focus && styles.textFocus}`}
      >
        {contents}
      </div>
    </div>
  );
}

export default Question;
