import React from 'react';
import { PostProp } from 'types/posts';
import styles from 'styles/PostCard.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Category } from 'types/posts';

function PostCard({ post }: PostProp) {
  const {
    interview_id,
    title,
    category,
    recruitStatus,
    currentMember,
    maxMember,
    host,
    profile,
  } = post;
  const router = useRouter();

  const handlePostCardClick = async () => {
    await router.push(`/post/${interview_id}`);
  };

  return (
    <div className={styles.container} onClick={handlePostCardClick}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.hashtagContainer}>
        {category?.map((item: Category) => {
          const { id, name } = item;
          return (
            <h4 className={styles.hashtag} key={id}>
              {name}
            </h4>
          );
        })}
      </div>
      <div className={styles.footer}>
        <div className={styles.user}>
          <Image src={profile} alt="user" width={30} height={30} />
          <p> {host} </p>
        </div>
        <p>
          {recruitStatus > 0 ? `모집마감` : `${currentMember}/${maxMember}명`}
        </p>
      </div>
    </div>
  );
}

export default PostCard;
