import styles from "styles/PostPage.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useApplyInterview } from "utils/hooks/useApplyInterview";
import { AxiosError } from "axios";
import { loginModalSet } from "states/loginModal";
import { joinStatustState } from "states/joinStatus";
export function InterviewJoinButtonComponent({
  setCurMember,
  postId,
}: {
  setCurMember: React.Dispatch<React.SetStateAction<number | undefined>>;
  postId: string | undefined;
}) {
  const router = useRouter();

  //TODO::타입 적용
  const { mutate, isError, isSuccess, error }: any = useApplyInterview({
    id: postId,
  });
  const [joinStatus, setJoinStatus] = joinStatustState();
  const setLoginModalVisible = loginModalSet();
  const buttonMsg = ["신청하기", "모집완료", "신청완료", "참여하기", "완료"];
  const handleJoinClick = async () => {
    if (joinStatus === 0 && postId) {
      mutate(postId);
    }

    if (joinStatus === 3) {
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
      setJoinStatus(2);
      setCurMember((prev) => {
        if (prev) {
          return prev + 1;
        }
      });
    }
  }, [isSuccess]);
  if (joinStatus === -1) {
    return null;
  }

  return (
    <button
      className={`${styles.joinButton} ${
        (joinStatus === 1 || joinStatus === 4 || joinStatus === 2) &&
        styles.inActive
      }`}
      onClick={handleJoinClick}
    >
      {buttonMsg[joinStatus]}
    </button>
  );
}
