import styles from "styles/PostPage.module.scss";
import React, { useState } from "react";
import { useRouter } from "next/router";

export function InterviewJoinButton({
  initialUserState,
  postId,
}: {
  initialUserState: number;
  postId: number | undefined;
}) {
  const [joinState, setJoinState] = useState(initialUserState /* userState */);
  const joinButtonName = ["신청 하기", "신청 중", "승인됨", "거부됨"];
  const router = useRouter();

  const handleJoinClick = async () => {
    //POST API CALL

    //Test
    /*
    setJoinState((prev) => {
      prev += 1;
      if (prev === 4) {
        prev = 0;
      }
      return prev;
    });*/
    await router.replace(`../room/${postId}`);
  };

  return (
    <button className={styles.joinButton} onClick={handleJoinClick}>
      {joinButtonName[joinState]}
    </button>
  );
}
