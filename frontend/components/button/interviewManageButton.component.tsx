import styles from "styles/PostPage.module.scss";
import React, { useState, useEffect } from "react";
import { joinStatustState } from "states/joinStatus";

import { useRouter } from "next/router";

const InterviewManageButton = ({ id }: { id: string | undefined }) => {
  const router = useRouter();
  const [joinStatus, setJoinStatus] = joinStatustState();

  const handleQuestionBtnClicked = async () => {
    await router.push(`/mypage/interview/${id}`);
  };
  const handleFeedbackBtnClicked = async () => {
    await router.push(`/mypage/feedback/${id}`);
  };

  const questionVisible = joinStatus === 2;
  const feedbackVisible = joinStatus === 4;
  const buttonAttributes = [
    {
      name: "질문 관리",
      isVisible: questionVisible,
      onClick: handleQuestionBtnClicked,
      /* postData?.userStatus !== undefined && postData?.userStatus === 2, */
      /* userStatus === 2 => 승인 */
    },
    {
      name: "피드백",
      isVisible: feedbackVisible,
      onClick: handleFeedbackBtnClicked,
      /* postData?.recruitStatus !== undefined && postData?.recruitStatus === 1,*/
      /* 모의 면접 종료 후 */
    },
  ];
  if (joinStatus === -1) {
    return null;
  }
  return (
    <>
      {buttonAttributes?.map((attribute) => {
        if (!attribute.isVisible) {
          return;
        }
        return (
          <li className={styles.postButtonLi} key={attribute.name}>
            <button
              className={styles.postPageButton}
              onClick={attribute.onClick}
            >
              {" "}
              {attribute.name}{" "}
            </button>
          </li>
        );
      })}
    </>
  );
};

export { InterviewManageButton };
