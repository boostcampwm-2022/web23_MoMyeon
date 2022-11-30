import React from "react";
import styles from "styles/Question.module.scss";
import { useQuestionQuery } from "utils/hooks/useInterviewQuery";
import QAPair from "./qaPair";

function QAContainer({ cur, id }: { cur: number; id: string }) {
  const { data } = useQuestionQuery({ id });

  if (data === undefined) {
    return <div>로딩중</div>;
  }
  return (
    <div className={styles.outContainer}>
      <div>{data[cur].userName}</div>

      {data[cur].question.map((item: any) => {
        return <QAPair key={item.id} data={item} />;
      })}
    </div>
  );
}

export default QAContainer;
