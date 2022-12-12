import React from "react";
import { useMyQuestionQuery } from "utils/hooks/useMyQuestion/useMyQuestionQuery";
import MyQuestionContainer from "./myQuestionContainer.component";

import BoxContainer from "components/boxContainer";
function MyQuestion() {
  const { data } = useMyQuestionQuery();
  return (
    <BoxContainer width="40rem" height="32rem" overflow>
      <>
        <div style={{ fontSize: "20px", alignSelf: "center" }}>
          내 질문 리스트
        </div>
        {data?.map((item) => {
          const { id } = item;
          return <MyQuestionContainer key={id} data={item} />;
        })}
      </>
    </BoxContainer>
  );
}

export default MyQuestion;
