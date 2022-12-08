import React, { useState } from "react";
import styles from "styles/Question.module.scss";
import question from "public/icon/question.png";
import Image from "next/image";

interface QuestionProp {
  id?: number;
  contents: string;
  focus?: boolean;
  onClickText?: () => void;
  HoverIcon?: () => JSX.Element;
}
function Question({
  id,
  contents,
  focus,
  onClickText,
  HoverIcon,
}: QuestionProp) {
  const [hover, setHover] = useState(false);
  const toggleHover = () => {
    setHover(!hover);
  };
  return (
    <div
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
      className={styles.container}
    >
      <div className={styles.icon}>
        <Image src={question} width={35} height={35} alt={"question-mark"} />
      </div>
      <div
        onClick={onClickText && onClickText}
        className={`${styles.textContainer} ${focus && styles.textFocus}`}
      >
        <span className={styles.text}>{contents}</span>
        {HoverIcon && hover && <HoverIcon />}
      </div>
    </div>
  );
}

export default Question;
