import React, { useEffect, useRef } from "react";
import styles from "styles/Question.module.scss";

interface Answer {
  id: number;
  feedback: string;
  focus: boolean;
  username: string;
}
function Answer({ id, feedback, focus, username }: Answer) {
  const textRef = useRef<null | HTMLTextAreaElement>(null);
  const localKey = `${username}:${id}`;
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textRef.current) {
      textRef.current.value = e.target.value;
      localStorage.setItem(localKey, textRef?.current.value);
    }
  };
  useEffect(() => {
    if (textRef.current) {
      const local = localStorage.getItem(localKey);
      if (local) textRef.current.value = local;
    }
  }, [textRef.current, localKey]);
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
