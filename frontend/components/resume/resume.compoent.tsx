import React from "react";
import styles from "styles/Resume.module.scss";
import { useMemberQuery } from "utils/hooks/useInterviewQuery";
import { ResumeItem, ResumeT } from "types/resume";
import { useRecoilValue } from "recoil";
import { interviewUser } from "states/user";

function Resume({ id }: { id: string }) {
  const { data } = useMemberQuery({ id });
  const cur = useRecoilValue(interviewUser);

  if (data === undefined) {
    return <div>loading</div>;
  }
  if (data.length === 0) {
    return <div>이력서가 없습니다</div>;
  }
  const {
    userId,
    nickname,
    resume: resumeArr,
  } = data.filter((item: ResumeT) => item.userId === cur)[0];

  return (
    <div>
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
