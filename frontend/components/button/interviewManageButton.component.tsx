import styles from "styles/PostPage.module.scss";
import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

const InterviewManageButton = ({
  userStatus,
}: {
  userStatus: number | undefined;
}) => {
  const router = useRouter();

  const [questionVisible, setQuestionVisbile] = useState(false);
  useEffect(() => {
    if (userStatus === 2) {
      setQuestionVisbile(true);
    }
  }, [userStatus]);

  const handleQuestionBtnClicked = async () => {
    await router.push("../mypage/question");
  };
  const handleFeedbackBtnClicked = async () => {};

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
      isVisible: true,
      onClick: handleFeedbackBtnClicked,
      /* postData?.recruitStatus !== undefined && postData?.recruitStatus === 1,*/
      /* 모의 면접 종료 후 */
    },
  ];

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
              onClick={handleQuestionBtnClicked}
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
