import { FeedbackData, FeedbackQuestionData } from "types/feedback";
import styles from "styles/Feedback.module.scss";

const FeedbackItemRecv = ({
  feedbackData,
  userName,
}: {
  feedbackData: FeedbackData;
  userName: string;
}) => {
  return (
    <ul className={styles.sendContainer}>
      <li className={styles.sendHeader}> 나에게 온 피드백 </li>
      {feedbackData.question?.map(
        (questionData: FeedbackQuestionData, question_idx: number) => {
          if (questionData.feedback === "") {
            /* 피드백 내용이 없으면 */ return;
          }
          if (questionData.nickname === userName) {
            /* 나에게 온 피드백이면서 내가 쓴 피드백이라면 */ return;
          }
          return (
            <ul className={styles.qaHeader} key={question_idx}>
              <li> {questionData.nickname}님의 피드백 </li>
              <li className={styles.question}> {questionData.contents} </li>
              <li className={styles.answer}> {questionData.feedback} </li>
            </ul>
          );
        }
      )}
    </ul>
  );
};

export { FeedbackItemRecv };
