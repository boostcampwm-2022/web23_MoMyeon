import React from "react";
import styles from "styles/Resume.module.scss";
import { useMemberQuery } from "utils/hooks/useInterviewQuery";
import { ResumeItem, ResumeT } from "types/resume";
import { interviewUserValue } from "states/user";

function Resume({ id }: { id: string }) {
  const { data, isLoading, error } = useMemberQuery({ id });
  const cur = interviewUserValue();
  if (isLoading) {
    return <div>loading</div>;
  }
  if (error) {
    return <div>에러</div>;
  }
  if (data.length === 0 || !data || cur === -1) {
    return <div>이력서가 없습니다</div>;
  }
  const {
    userId,
    nickname,
    resume: resumeArr,
  } = data.filter((item: ResumeT) => item.userId === cur)[0] || {};

  return (
    <div>
      <div className={styles.text}>{nickname} 님의 이력서</div>
      {resumeArr?.map((item: ResumeItem) => {
        const { title, content } = item;
        return (
          <div key={title}>
            <div className={styles.text}>{title}:</div>
            <br />
            <div className={styles.text}>{content}</div>
            <br />
          </div>
        );
      })}
    </div>
  );
}

export default Resume;
