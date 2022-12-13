import React from "react";
import Title from "components/title";
import { Props } from "./postCard.d";
import PostCard from "./postCard";
import styles from "styles/MyManage.module.scss";

function Host({ data }: Props) {
  return (
    <div className={styles.postContainer}>
      <Title text="내가 만든 모의 면접" />
      <div className={styles.scroll}>
        {data?.map((item) => {
          const { title, interview_id, category, status } = item;

          return (
            <PostCard
              status={status}
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

export default Host;
