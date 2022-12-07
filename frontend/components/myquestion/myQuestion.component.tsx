import Title from "components/title";
import React from "react";
import styles from "styles/MypageQuestion.module.scss";
import { useMyQuestionQuery } from "utils/hooks/useMyQuestionQuery";
import CreateQuestion from "./createQuestion.component";
import QuestionContainer from "./questionContainer.component";
function MyQuestion() {
  const { data, isLoading, error } = useMyQuestionQuery();
  return (
    <div className={styles.container}>
      <Title text="내 질문 리스트" />
      <div className={styles.questionContainer}>
        {data?.map((item) => {
          const { id } = item;
          return <QuestionContainer key={id} data={item} />;
        })}
      </div>
      <div className={styles.createQuestion}>
        <CreateQuestion />
      </div>
    </div>
  );
}

export default MyQuestion;
