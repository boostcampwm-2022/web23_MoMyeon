import React from "react";
import Title from "components/title";
import { Props } from "./postCard.d";
import PostCard from "./postCard";
function Host({ data }: Props) {
  return (
    <div>
      <Title text="내가 만든 모의 면접" />
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
  );
}

export default Host;
