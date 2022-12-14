import { FeedbackData, FeedbackQuestionData } from "types/feedback";
import styles from "styles/Feedback.module.scss";
import myPageStyles from "styles/MyPageFeedback.module.scss";

const FeedbackItemSend = ({
  feedbackData,
  userName,
  isMyPage,
}: {
  feedbackData: FeedbackData;
  userName: string;
  isMyPage: boolean;
}) => {
  return (
    <ul
      className={isMyPage ? myPageStyles.sendContainer : styles.sendContainer}
    >
      <li className={isMyPage ? myPageStyles.sendHeader : styles.sendHeader}>
        {" "}
        {feedbackData.userName}에게 쓴 피드백{" "}
      </li>
      {feedbackData.question?.map(
        (questionData: FeedbackQuestionData, question_idx: number) => {
          if (questionData.feedback === "") {
            /* 피드백 내용이 없으면 */ return;
          }

          if (questionData.nickname !== userName) {
            /* 다른 사람의 피드백이면서 내가 쓴 피드백이 아니면 */ return;
          }

          return (
            <ul
              className={isMyPage ? myPageStyles.qaHeader : styles.qaHeader}
              key={question_idx}
            >
              <li
                className={isMyPage ? myPageStyles.question : styles.question}
              >
                {" "}
                {questionData.contents}{" "}
              </li>
              <li className={isMyPage ? myPageStyles.answer : styles.answer}>
                {" "}
                {questionData.feedback}{" "}
              </li>
            </ul>
          );
        }
      )}
    </ul>
  );
};

export { FeedbackItemSend };
