import React from "react";
import styles from "styles/Question.module.scss";
import { useQuestionQuery } from "utils/hooks/useInterviewQuery";
import QAPair from "./qaPair";
import { interviewUserValue } from "states/user";
import { QAItem } from "./question";

function QAContainer({ id }: { id: string }) {
  const { data } = useQuestionQuery({ id });
  const cur = interviewUserValue();
  if (data === undefined) {
    return <div>로딩중</div>;
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
