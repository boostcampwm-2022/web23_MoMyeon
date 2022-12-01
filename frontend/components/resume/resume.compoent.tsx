import React from "react";
import styles from "styles/Resume.module.scss";
import { useMemberQuery } from "utils/hooks/useInterviewQuery";

interface ResumeItem {
  title: string;
  content: string;
}
interface Resume {
  userId: number;
  nickname: string;
  resume: ResumeItem[];
}

interface ResumeProp {
  resume: Resume;
}

function Resume({ cur, id }: { cur: number; id: string }) {
  const { data } = useMemberQuery({ id });
  if (data === undefined) {
    return <div>loading</div>;
  }
  if (data.length === 0) {
    return <div>이력서가 없습니다</div>;
  }
  const { userId, nickname, resume: resumeArr } = data[cur];
  return (
    <div className={styles.container}>
      <div className={styles.text}>{nickname} 님의 이력서</div>
      {resumeArr?.map((item: ResumeItem) => {
        const { title, content } = item;
        return (
          <div key={title} className={styles.text}>
            {title}: {content}
          </div>
        );
      })}
    </div>
  );
}

export default Resume;
