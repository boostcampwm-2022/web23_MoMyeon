import React, { useRef } from "react";
import styles from "styles/Question.module.scss";

interface Answer {
  id: number;
  feedback: string;
  focus: boolean;
}
function Answer({ id, feedback, focus }: Answer) {
  const textRef = useRef<null | HTMLTextAreaElement>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textRef.current) textRef.current.value = e.target.value;
  };
  return (
    <div>
      <textarea
        className={`${styles.inputContainer} ${focus && styles.show}`}
        ref={textRef}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
}

export default Answer;
