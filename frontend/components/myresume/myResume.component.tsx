import React, { useRef } from "react";
import styles from "styles/MypageResume.module.scss";
import Title from "components/title";
import ResumeContainer from "./resumeContainer.component";
import ResumeCreate from "./resumeCreate.component";
import { resumeValue } from "states/resume";
import { useMyResumeQuery } from "utils/hooks/useMyResumeQuery";

function MyResume() {
  const resume = resumeValue();
  const { item } = resume;
  const { data } = useMyResumeQuery();
  return (
    <div className={styles.container}>
      <Title text="내 이력서" />
      {data?.map((item) => {
        const { itemId, item: itemD, content } = item;
        return (
          <ResumeContainer
            key={itemId}
            item={itemD}
            itemId={itemId}
            content={content}
          />
        );
      })}
      {item !== null && <ResumeCreate />}
    </div>
  );
}

export default MyResume;
