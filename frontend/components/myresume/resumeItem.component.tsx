import React, { useState } from "react";
import { ResumeItemProps } from "./resume";
import styles from "styles/MypageResume.module.scss";
import Image from "next/image";
import deleteQuestion from "public/icon/deleteQuestion.png";
import { useMyResumeDelete } from "utils/hooks/useMyResume/useMyResumeDelete";
function ResumeItem({ data }: ResumeItemProps) {
  const { text, id } = data;
  const [hover, setHover] = useState(false);
  const { mutate } = useMyResumeDelete();

  const hoverToggle = () => {
    setHover(!hover);
  };

  const onClickDelete = () => {
    mutate(id);
  };

  return (
    <div
      onMouseEnter={hoverToggle}
      onMouseLeave={hoverToggle}
      className={styles.resumeItemContainer}
    >
      <div className={styles.resumeItem}>- {text}</div>
      {hover && (
        <Image
          onClick={onClickDelete}
          className={styles.deleteIcon}
          src={deleteQuestion}
          width={24}
          height={24}
          alt="이력 지우기"
        />
      )}
    </div>
  );
}

export default ResumeItem;
