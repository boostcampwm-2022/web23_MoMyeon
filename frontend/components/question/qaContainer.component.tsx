import React from "react";
import QAPair from "./qaPair.component";
import { useQuestionQuery } from "utils/hooks/useInterviewQuery";
import { interviewUserValue } from "states/user";
import { QAItem } from "./question";

function QAContainer({ id }: { id: string }) {
  const { data, isLoading, error } = useQuestionQuery({ id });
  const cur = interviewUserValue();
  if (isLoading) {
    return <div>loading</div>;
  }
  if (error) {
    return <div>에러</div>;
  }
  if (data.length === 0 || cur === -1) {
    return <div>데이터 없음</div>;
  }

  const filtered = data.filter((item: QAItem) => item.userId === cur)[0];
  const { userName, userId } = filtered;
  return (
    <div>
      <div>{filtered.userName}</div>

      {filtered.question.map((item: any, index: number) => {
        const { type, id, userId } = item;
        const key = `${id}${type}${index}${userId}`;
        return (
          <QAPair key={key} username={userName} userId={userId} data={item} />
        );
      })}
    </div>
  );
}

export default QAContainer;
