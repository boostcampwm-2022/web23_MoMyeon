import styles from "styles/feedback.module.scss";
import { useFeedbackQuery } from "utils/hooks/useFeeedbackQuery";
import { useEffect, useState } from "react";
import { useUserDataQuery } from "../../utils/hooks/useUserDataQuery";
import { FeedbackFilterHeader } from "./feedbackFilterHeader.component";
import { FeedbackData } from "types/feedback";
import { FeedbackItem } from "./feedbackItem.component";

const Feedback = ({ roomName }: { roomName: string }) => {
  const { data, isError, isSuccess } = useFeedbackQuery(roomName);
  const {
    data: userData,
    isSuccess: isUserDataSuccess,
    isError: isUserDataError,
  } = useUserDataQuery();

  const [myFeedbacksState, setMyFeedbacksState] = useState<FeedbackData[]>();
  const [otherFeedbacksState, setOtherFeedbacksState] =
    useState<FeedbackData[]>();
  const [userName, setUserName] = useState<string>("");

  const [isReceivedFeedback, setIsReceivedFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess && isUserDataSuccess) {
      const feedbacksData: FeedbackData[] = data?.data?.feedbacks;
      const myFeedbacksData: FeedbackData[] = feedbacksData.filter(
        (feedbackData) => feedbackData.userName === userData?.data.nickname
      );
      const otherFeedbacksData: FeedbackData[] = feedbacksData.filter(
        (feedbackData) => feedbackData.userName !== userData?.data.nickname
      );
      setMyFeedbacksState(myFeedbacksData);
      setOtherFeedbacksState(otherFeedbacksData);
      setUserName(userData?.data.nickname);
      window.localStorage.clear();
    }
  }, [isSuccess, isUserDataSuccess]);

  if (!isSuccess || !isUserDataSuccess) {
    return <div className={styles.backdrop}>로딩 중 입니다.</div>;
  }

  if (isError || isUserDataError) {
    return <div className={styles.backdrop}> 에러입니다. </div>;
  }

  return (
    <div className={styles.backdrop}>
      <FeedbackFilterHeader
        isReceivedFeedback={isReceivedFeedback}
        setIsReceivedFeedback={setIsReceivedFeedback}
      />
      {isReceivedFeedback
        ? myFeedbacksState?.map((feedbackData: FeedbackData, idx: number) => {
            return (
              <FeedbackItem
                key={idx}
                feedbackData={feedbackData}
                userName={userName}
                isReceivedFeedback={isReceivedFeedback}
              />
            );
          })
        : otherFeedbacksState?.map(
            (feedbackData: FeedbackData, idx: number) => {
              return (
                <FeedbackItem
                  key={idx}
                  feedbackData={feedbackData}
                  userName={userName}
                  isReceivedFeedback={isReceivedFeedback}
                />
              );
            }
          )}
    </div>
  );
};

export { Feedback };
