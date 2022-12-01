import React from "react";
import styles from "styles/Question.module.scss";
import { useQuestionQuery } from "utils/hooks/useInterviewQuery";
import QAPair from "./qaPair";
import { useRecoilValue } from "recoil";
import { interviewUser } from "states/user";
import { QAItem } from "./question";

function QAContainer({ id }: { id: string }) {
  const { data } = useQuestionQuery({ id });
  const cur = useRecoilValue(interviewUser);
  if (data === undefined) {
    return <div>로딩중</div>;
  }
  if (data.length === 0) {
    return <div>데이터 없음</div>;
  }
  console.log(data, cur);
  const filtered = data.filter((item: QAItem) => item.userId === cur)[0];
  return (
    <div>
      <div>{filtered.userName}</div>

      {filtered.question.map((item: any) => {
        return <QAPair key={item.id} data={item} />;
      })}
    </div>
  );
}

export default QAContainer;
