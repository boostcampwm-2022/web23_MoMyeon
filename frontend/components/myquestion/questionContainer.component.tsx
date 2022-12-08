import React, { useState, useCallback } from "react";
import Question from "components/question/question.component";
import { useMyQuestionDelete } from "utils/hooks/useMyQuestion/useMyQuestionDelete";
import deleteQuestion from "public/icon/deleteQuestion.png";
import Image from "next/image";
import styles from "styles/MypageQuestion.module.scss";

function QuestionContainer({
  data,
}: {
  data: { id: number; contents: string };
}) {
  const [focus, setFocus] = useState(false);
  const { id, contents } = data;
  const { mutate } = useMyQuestionDelete();

  const HoverIcon = useCallback(() => {
    const onClickDelete = () => {
      mutate(id);
    };

    return (
      <Image
        className={styles.deleteIcon}
        onClick={onClickDelete}
        src={deleteQuestion}
        alt="질문 삭제"
        width={24}
        height={24}
      />
    );
  }, [mutate, id]);

  return (
    <Question HoverIcon={HoverIcon} focus={focus} id={id} contents={contents} />
  );
}

export default QuestionContainer;
