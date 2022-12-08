import React, { useState } from "react";
import { questionTextSet } from "states/questionManage";
import Question from "components/question/question.component";

interface Props {
  data: { id: number; contents: string };
}
function MyQuestionContainer({ data }: Props) {
  const { id, contents } = data;
  const setText = questionTextSet();
  const onClickText = () => {
    setText(contents);
  };
  return <Question id={id} onClickText={onClickText} contents={contents} />;
}

export default MyQuestionContainer;
