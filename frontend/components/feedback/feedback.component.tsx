import styles from "styles/Feedback.module.scss";
import { useFeedbackQuery } from "utils/hooks/useFeeedbackQuery";
import { useEffect, useState } from "react";
import { useUserDataQuery } from "../../utils/hooks/useUserDataQuery";
import { FeedbackFilterHeader } from "./feedbackFilterHeader.component";
import { FeedbackData, FeedbackQuestionData } from "types/feedback";
import { FeedbackItemSend } from "./feedbackItemSend.component";
import { FeedbackItemRecv } from "./feedbackItemRecv.component";

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

      if (myFeedbacksData.length >= 1) {
        const sortedQuestions: FeedbackQuestionData[] =
          myFeedbacksData[0]?.question.filter(
            (questionData) =>
              questionData.feedback !== "" &&
              questionData.nickname !== userData?.data.nickname
          );

        const processed = sortedQuestions.reduce((acc: any, item) => {
          const group = item.nickname;
          if (!acc[group]) acc[group] = [];
          acc[group].push(item);
          return acc;
        }, {});

        console.log(processed);
      }

      setMyFeedbacksState(myFeedbacksData);
      setOtherFeedbacksState(otherFeedbacksData);
      setUserName(userData?.data.nickname);
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
      <div className={styles.feedbackDataContainer}>
        {isReceivedFeedback
          ? myFeedbacksState?.map((feedbackData: FeedbackData, idx: number) => {
              return (
                <FeedbackItemRecv
                  key={idx}
                  feedbackData={feedbackData}
                  userName={userName}
                />
              );
            })
          : otherFeedbacksState?.map(
              (feedbackData: FeedbackData, idx: number) => {
                return (
                  <FeedbackItemSend
                    key={idx}
                    feedbackData={feedbackData}
                    userName={userName}
                  />
                );
              }
            )}
      </div>
    </div>
  );
};

export { Feedback };
