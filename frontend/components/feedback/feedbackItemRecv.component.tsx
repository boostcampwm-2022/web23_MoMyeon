import { ProcessedFeedbackData } from "types/feedback";
import styles from "styles/Feedback.module.scss";
import myPageStyles from "styles/MyPageFeedback.module.scss";
import React from "react";

const FeedbackItemRecv = ({
  processedFeedbackData,
  isMyPage,
}: {
  processedFeedbackData: ProcessedFeedbackData[] | undefined;
  userName: string;
  isMyPage: boolean;
}) => {
  return (
    <>
      {processedFeedbackData?.map((processedFeedbackData, idx) => {
        return (
          <ul
            className={
              isMyPage ? myPageStyles.sendContainer : styles.sendContainer
            }
            key={idx}
          >
            <li
              className={isMyPage ? myPageStyles.sendHeader : styles.sendHeader}
            >
              {" "}
              {processedFeedbackData.userName}님의 피드백{" "}
            </li>
            {processedFeedbackData.question?.map(
              (feedbackQuestionData, question_idx) => {
                return (
                  <ul
                    className={
                      isMyPage ? myPageStyles.qaHeader : styles.qaHeader
                    }
                    key={question_idx}
                  >
                    <li
                      className={
                        isMyPage ? myPageStyles.question : styles.question
                      }
                    >
                      {" "}
                      {feedbackQuestionData.contents}{" "}
                    </li>
                    <li
                      className={isMyPage ? myPageStyles.answer : styles.answer}
                    >
                      {" "}
                      {feedbackQuestionData.feedback}{" "}
                    </li>
                  </ul>
                );
              }
            )}
          </ul>
        );
      })}
    </>
  );
};

export { FeedbackItemRecv };
