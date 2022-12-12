import React, { useEffect, useRef } from "react";
import patchFeedback from "utils/api/feedbackCreate/patchFeedback";
import styles from "styles/Question.module.scss";
import { useRouter } from "next/router";

interface Answer {
  id: number;
  userId: number;
  type: number;
  feedback: string;
  focus: boolean;
  username: string;
}
function Answer({ id, type, feedback, focus, username, userId }: Answer) {
  const router = useRouter();
  const room = router.query.room as string;

  const textRef = useRef<null | HTMLTextAreaElement>(null);
  const localKey = `${userId}:${username}:${type}:${id}:${room}`;
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textRef.current) {
      textRef.current.value = e.target.value;
      localStorage.setItem(localKey, textRef?.current.value);
    }
  };

  const onBlurFocus = () => {
    const text = textRef.current ? textRef.current.value : "";
    patchFeedback({
      userId: userId,
      nickname: username,
      type,
      questionId: id,
      feedback: text,
      roomId: room,
    });
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
        onBlur={onBlurFocus}
      />
    </div>
  );
}

export default Answer;
