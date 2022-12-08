import React, { useState } from "react";
import Question from "./question.component";
import Answer from "./answer.component";
import { QuestionProp, User } from "./question";
function QAPair({ data, username, userId }: QuestionProp & User) {
  const { type, id, content, feedback } = data;
  const [focus, setFocus] = useState(false);
  const onClickText = () => {
    setFocus(!focus);
  };

  return (
    <div>
      <Question
        onClickText={onClickText}
        focus={focus}
        id={id}
        contents={content}
      />
      <Answer
        focus={focus}
        id={id}
        type={type}
        userId={userId}
        feedback={feedback}
        username={username}
      />
    </div>
  );
}

export default QAPair;
