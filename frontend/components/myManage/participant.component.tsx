import React from "react";
import Title from "components/title";
import { Props } from "./postCard.d";
import PostCard from "./postCard";
import styles from "styles/MyManage.module.scss";

function Participant({ data }: Props) {
  return (
    <div className={styles.postContainer}>
      <Title text="내가 신청한 면접" />
      <div className={styles.scroll}>
        {data?.map((item) => {
          const { title, interview_id, category } = item;

          return (
            <PostCard
              key={interview_id}
              id={interview_id}
              title={title}
              category={category}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Participant;
