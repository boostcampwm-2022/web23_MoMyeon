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
  return (
    <div>
      <div>{filtered.userName}</div>

      {filtered.question.map((item: any) => {
        return (
          <QAPair
            key={`${item.id}${filtered.userName}`}
            username={filtered.userName}
            data={item}
          />
        );
      })}
    </div>
  );
}

export default QAContainer;