import { FeedbackData, FeedbackQuestionData } from "types/feedback";

const FeedbackItemRecv = ({
  feedbackData,
  userName,
}: {
  feedbackData: FeedbackData;
  userName: string;
}) => {
  return (
    <ul>
      <li> 나에게 온 피드백 </li>
      {feedbackData.question?.map(
        (questionData: FeedbackQuestionData, question_idx: number) => {
          if (questionData.feedback === "") {
            /* 피드백 내용이 없으면 */ return;
          }
          if (questionData.nickname === userName) {
            /* 나에게 온 피드백이면서 내가 쓴 피드백이라면 */ return;
          }
          return (
            <ul key={question_idx}>
              <li> {questionData.nickname}님의 피드백 </li>
              <li> 질문: {questionData.contents} </li>
              <li> 피드백: {questionData.feedback} </li>
            </ul>
          );
        }
      )}
    </ul>
  );
};

export { FeedbackItemRecv };
