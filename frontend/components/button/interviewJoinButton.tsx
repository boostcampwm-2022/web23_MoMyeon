import styles from "styles/PostPage.module.scss";
import React, { useState } from "react";

export function InterviewJoinButton({
  initialUserState,
}: {
  initialUserState: number;
}) {
  const [joinState, setJoinState] = useState(initialUserState /* userState */);
  const joinButtonName = ["신청 하기", "신청 중", "승인됨", "거부됨"];

  const handleJoinClick = () => {
    //POST API CALL

    //Test
    setJoinState((prev) => {
      prev += 1;
      if (prev === 4) {
        prev = 0;
      }
      return prev;
    });
  };

  return (
    <button className={styles.joinButton} onClick={handleJoinClick}>
      {joinButtonName[joinState]}
    </button>
  );
}
