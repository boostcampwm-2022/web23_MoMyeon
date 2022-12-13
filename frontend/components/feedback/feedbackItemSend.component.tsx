import { FeedbackData, FeedbackQuestionData } from "types/feedback";

const FeedbackItemSend = ({
  feedbackData,
  userName,
}: {
  feedbackData: FeedbackData;
  userName: string;
}) => {
  return (
    <ul>
      <li> {feedbackData.userName}에게 쓴 피드백 </li>
      {feedbackData.question?.map(
        (questionData: FeedbackQuestionData, question_idx: number) => {
          if (questionData.feedback === "") {
            /* 피드백 내용이 없으면 */ return;
          }

          if (questionData.nickname !== userName) {
            /* 다른 사람의 피드백이면서 내가 쓴 피드백이 아니면 */ return;
          }

          return (
            <ul key={question_idx}>
              <li> 질문: {questionData.contents} </li>
              <li> 피드백: {questionData.feedback} </li>
            </ul>
          );
        }
      )}
    </ul>
  );
};

export { FeedbackItemSend };
