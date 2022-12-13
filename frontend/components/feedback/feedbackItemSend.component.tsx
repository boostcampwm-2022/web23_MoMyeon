import { FeedbackData, FeedbackQuestionData } from "types/feedback";
import styles from "styles/Feedback.module.scss";

const FeedbackItemSend = ({
  feedbackData,
  userName,
}: {
  feedbackData: FeedbackData;
  userName: string;
}) => {
  return (
    <ul className={styles.sendContainer}>
      <li className={styles.sendHeader}>
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
            <ul className={styles.qaHeader} key={question_idx}>
              <li className={styles.question}> {questionData.contents} </li>
              <li className={styles.answer}> {questionData.feedback} </li>
            </ul>
          );
        }
      )}
    </ul>
  );
};

export { FeedbackItemSend };
