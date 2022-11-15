import React from "react";
import { Posts, Post } from "types/posts";
import PostCard from "./postCard.component";
import styles from "styles/PostCard.module.scss";

function PostContainer({ posts }: Posts) {
  return (
    <div className={styles.outerContainer}>
      {posts.map((item: Post) => {
        return <PostCard key={item.title} post={item} />;
      })}
    </div>
  );
}

export default PostContainer;
