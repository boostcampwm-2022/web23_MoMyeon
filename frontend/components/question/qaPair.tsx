import React, { useState } from "react";
import Question from "./question.component";
import Answer from "./answer.component";
import { QuestionProp, Username } from "./question";
function QAPair({ data, username }: QuestionProp & Username) {
  const { id, contents, feedback } = data;
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <Question setFocus={setFocus} focus={focus} id={id} contents={contents} />
      <Answer focus={focus} id={id} feedback={feedback} username={username} />
    </div>
  );
}

export default QAPair;
