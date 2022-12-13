import { ProcessedFeedbackData } from "types/feedback";
import styles from "styles/Feedback.module.scss";

const FeedbackItemRecv = ({
  processedFeedbackData,
}: {
  processedFeedbackData: ProcessedFeedbackData[] | undefined;
  userName: string;
}) => {
  return (
    <>
      {processedFeedbackData?.map((processedFeedbackData, idx) => {
        return (
          <ul className={styles.sendContainer} key={idx}>
            <li className={styles.sendHeader}>
              {" "}
              {processedFeedbackData.userName}님의 피드백{" "}
            </li>
            {processedFeedbackData.question?.map(
              (feedbackQuestionData, question_idx) => {
                return (
                  <ul className={styles.qaHeader} key={question_idx}>
                    <li className={styles.question}>
                      {" "}
                      {feedbackQuestionData.contents}{" "}
                    </li>
                    <li className={styles.answer}>
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
