import styles from "styles/PostPage.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useApplyInterview } from "utils/hooks/useApplyInterview";
import { AxiosError } from "axios";
import { loginModalSet } from "states/loginModal";

export function InterviewJoinButtonComponent({
  setCurMember,
  isHost,
  userStatus,
  postId,
}: {
  setCurMember: React.Dispatch<React.SetStateAction<number | undefined>>;
  isHost: boolean | undefined;
  userStatus: number | undefined;
  postId: string | undefined;
}) {
  const router = useRouter();

  //TODO::타입 적용
  const { mutate, isError, isSuccess, error }: any = useApplyInterview();

  const [joinState, setJoinState] = useState(isHost ? 2 : userStatus); //0이랑 2만 사용
  const setLoginModalVisible = loginModalSet();

  useEffect(() => {
    if (isHost || userStatus === 2) {
      setJoinState(2);
    }
  }, [isHost, userStatus]);

  const handleJoinClick = async () => {
    if (joinState !== 2 && postId) {
      mutate(postId);
    }

    if (joinState === 2) {
      await router.replace(`../room/${postId}`);
    }
  };

  useEffect(() => {
    if (isError) {
      if (error.response.status === 401) {
        setLoginModalVisible(true);
        //ModalOpen
      } else if (error.response.status === 403) {
        alert("신청이 마감 됐습니다");
      } else {
        console.log(error.message);
      }
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      alert("성공적으로 등록 됐습니다.");
      setJoinState(2);
      setCurMember((prev) => {
        if (prev) {
          return prev + 1;
        }
      });
    }
  }, [isSuccess]);

  return (
    <button className={styles.joinButton} onClick={handleJoinClick}>
      {joinState === 2 ? "참여하기" : "신청하기"}
    </button>
  );
}
