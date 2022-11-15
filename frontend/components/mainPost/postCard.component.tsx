import React from "react";
import { PostProp } from "types/posts";
import styles from "styles/PostCard.module.scss";
import userImage from "public/icon/user.png";
import Image from "next/image";
function PostCard({ post }: PostProp) {
  const { title, hashtag, user, view } = post;
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.hashtagContainer}>
        {hashtag.map((item: string) => {
          return (
            <h4 className={styles.hashtag} key={item}>
              {item}
            </h4>
          );
        })}
      </div>
      <div className={styles.footer}>
        <div className={styles.user}>
          <Image src={userImage} alt="user" width={30} height={30} />

          <p>{user}</p>
        </div>
        <p>{view}</p>
      </div>
    </div>
  );
}

export default PostCard;
