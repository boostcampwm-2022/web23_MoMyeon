import React, { useState, useCallback } from "react";
import Question from "components/question/question.component";
import { QuestionItem } from "utils/api/ManageQuestion/getManageQuestion";
import deleteQuestion from "public/icon/deleteQuestion.png";
import { useManageQuestionDelete } from "utils/hooks/useManageQuestion/useManageQuestionDelete";

import Image from "next/image";
interface QuestionItemProps {
  data: QuestionItem;
}
function QuestionItem({ data }: QuestionItemProps) {
  const { id, content } = data;
  const { mutate } = useManageQuestionDelete();
  const [focus, setFocus] = useState(false);

  const HoverIcon = useCallback(() => {
    const onClickDelete = () => {
      mutate(id);
    };

    return (
      <Image
        style={{ cursor: "pointer" }}
        onClick={onClickDelete}
        src={deleteQuestion}
        alt="질문 삭제"
        width={24}
        height={24}
      />
    );
  }, [mutate, id]);
  return (
    <div>
      <Question
        focus={focus}
        id={id}
        contents={content}
        HoverIcon={HoverIcon}
      />
    </div>
  );
}

export default QuestionItem;
