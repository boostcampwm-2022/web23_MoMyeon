import { FeedbackData, FeedbackQuestionData } from "types/feedback";
import question from "../../pages/mypage/question";

const FeedbackItem = ({
  feedbackData,
  userName,
  isReceivedFeedback,
}: {
  feedbackData: FeedbackData;
  userName: string;
  isReceivedFeedback: boolean;
}) => {
  return (
    <ul>
      {isReceivedFeedback ? (
        <li> 나에게 온 피드백 </li>
      ) : (
        <li> {feedbackData.userName}에게 쓴 피드백 </li>
      )}
      {feedbackData.question?.map(
        (questionData: FeedbackQuestionData, question_idx: number) => {
          if (questionData.feedback === "") {
            /* 피드백 내용이 없으면 */ return;
          }

          if (!isReceivedFeedback && questionData.nickname !== userName) {
            /* 다른 사람의 피드백이면서 내가 쓴 피드백이 아니면 */ return;
          }

          if (isReceivedFeedback && questionData.nickname === userName) {
            /* 나에게 온 피드백이면서 내가 쓴 피드백이라면 */ return;
          }

          return (
            <ul key={question_idx}>
              {isReceivedFeedback && (
                <li> {questionData.nickname}님의 피드백 </li>
              )}
              <li> 질문: {questionData.contents} </li>
              <li> 피드백: {questionData.feedback} </li>
            </ul>
          );
        }
      )}
    </ul>
  );
};

export { FeedbackItem };
