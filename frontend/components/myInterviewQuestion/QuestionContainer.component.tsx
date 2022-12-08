import React from "react";
import { interviewUserValue } from "states/user";
import { useManageQuestionQuery } from "utils/hooks/useManageQuestion/useManageQuestionQuery";
import QuestionItem from "./QuestionItem.component";
import BoxContainer from "components/boxContainer";
function QuestionContainer({ id }: { id: string }) {
  const { data, isLoading, error } = useManageQuestionQuery({ id });
  const cur = interviewUserValue();
  if (isLoading) {
    return <div>loading</div>;
  }
  if (error) {
    return <div>에러</div>;
  }
  if ((data && data.length === 0) || cur === -1) {
    return <div>데이터 없음</div>;
  }
  const filtered = data?.filter((item) => item.userId === cur)[0];
  return (
    <BoxContainer width="60rem" height="32rem">
      <div style={{ fontSize: "20px", alignSelf: "center" }}>
        {filtered?.userName}님의 질문 리스트
      </div>

      {filtered?.question.map((item) => {
        return (
          <QuestionItem key={`${item.id}${filtered.userName}`} data={item} />
        );
      })}
    </BoxContainer>
  );
}

export default QuestionContainer;
