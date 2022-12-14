import styles from "styles/Feedback.module.scss";
import myPageStyles from "styles/MyPageFeedback.module.scss";
import { Dispatch, SetStateAction } from "react";

const FeedbackFilterHeader = ({
  isReceivedFeedback,
  setIsReceivedFeedback,
  isMyPage,
}: {
  isReceivedFeedback: boolean;
  setIsReceivedFeedback: Dispatch<SetStateAction<boolean>>;
  isMyPage: boolean;
}) => {
  const handleFilterClicked = (isReceived: boolean) => {
    setIsReceivedFeedback(isReceived);
  };

  return (
    <div
      className={
        isMyPage ? myPageStyles.filterContainer : styles.filterContainer
      }
    >
      <div
        className={`${styles.filter} ${
          !isReceivedFeedback && styles.focusBottom
        }`}
        onClick={() => handleFilterClicked(false)}
      >
        {" "}
        내가 한 피드백{" "}
      </div>
      <div
        className={`${styles.filter} ${
          isReceivedFeedback && styles.focusBottom
        }`}
        onClick={() => handleFilterClicked(true)}
      >
        {" "}
        내가 받은 피드백{" "}
      </div>
    </div>
  );
};

export { FeedbackFilterHeader };
