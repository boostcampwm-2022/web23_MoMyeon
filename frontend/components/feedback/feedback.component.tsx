import styles from "styles/Feedback.module.scss";
import myPageStyles from "styles/MyPageFeedback.module.scss";
import { useFeedbackQuery } from "utils/hooks/useFeeedbackQuery";
import { useEffect, useState } from "react";
import { useUserDataQuery } from "../../utils/hooks/useUserDataQuery";
import { FeedbackFilterHeader } from "./feedbackFilterHeader.component";
import {
  FeedbackData,
  ProcessedFeedbackData,
  FeedbackQuestionData,
} from "types/feedback";
import { FeedbackItemSend } from "./feedbackItemSend.component";
import { FeedbackItemRecv } from "./feedbackItemRecv.component";

const Feedback = ({
  roomName,
  isMyPage,
}: {
  roomName: string;
  isMyPage: boolean;
}) => {
  const { data, isError, isSuccess } = useFeedbackQuery(roomName);

  const {
    data: userData,
    isSuccess: isUserDataSuccess,
    isError: isUserDataError,
  } = useUserDataQuery();

  //내가 다른 사람에게 받은 피드백
  const [myFeedbacksState, setMyFeedbacksState] =
    useState<ProcessedFeedbackData[]>();
  //내가 쓴 피드백
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

      //다른 사람에게 받은 피드백의 경우 출력 형식 맞추려면, 데이터 변형이 필요했음
      if (myFeedbacksData.length >= 1) {
        //피드백 안 쓴 질문이랑, 내가 나한테 쓴 피드백 거름
        const processedQuestions: FeedbackQuestionData[] =
          myFeedbacksData[0]?.question.filter(
            (questionData) =>
              questionData.feedback !== "" &&
              questionData.nickname !== userData?.data.nickname
          );

        //API가 랜덤으로 피드백을 주기 때문에, 작성자가 같은 것끼리 모음
        const processed = processedQuestions.reduce(
          (acc: any, currentValue) => {
            const group = currentValue.nickname;
            if (!acc[group]) {
              acc[group] = [];
            }
            acc[group].push(currentValue);
            return acc;
          },
          {}
        );

        //내가 쓴 피드백과 같은 형식으로 맞춤. 다만 userId는 모르기 때문에 새로운 타입
        const processedFeedbackData = Object.keys(processed).map((key) => {
          const ret: any = {};
          ret["userName"] = key;
          ret["question"] = processed[key];
          return ret;
        });

        setMyFeedbacksState(processedFeedbackData);
      }

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
    <div className={isMyPage ? myPageStyles.backdrop : styles.backdrop}>
      <FeedbackFilterHeader
        isReceivedFeedback={isReceivedFeedback}
        setIsReceivedFeedback={setIsReceivedFeedback}
        isMyPage={isMyPage}
      />
      <div
        className={
          isMyPage
            ? myPageStyles.feedbackDataContainer
            : styles.feedbackDataContainer
        }
      >
        {isReceivedFeedback ? (
          <FeedbackItemRecv
            processedFeedbackData={myFeedbacksState}
            userName={userName}
            isMyPage={isMyPage}
          />
        ) : (
          otherFeedbacksState?.map(
            (feedbackData: FeedbackData, idx: number) => {
              return (
                <FeedbackItemSend
                  key={idx}
                  feedbackData={feedbackData}
                  userName={userName}
                  isMyPage={isMyPage}
                />
              );
            }
          )
        )}
      </div>
    </div>
  );
};

export { Feedback };
