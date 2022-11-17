import React from "react";
import { PostProp } from "types/posts";
import styles from "styles/PostCard.module.scss";
import userImage from "public/icon/user.png";
import Image from "next/image";
import { useRouter } from "next/router";

function PostCard({ post }: PostProp) {
  const { title, hashtag, user, view } = post;
  const router = useRouter() ;

  //FIXME::
  // 문제:: title은 중복이 가능해서, 라우팅 정책 바꿔야 함,
  // 의견:: 데이터 요청할 때도 interview_id가 필요해서 interview_id로 하는 것이 좋아 보인다
  // 고려사항:: interview_id가 아직 API 설계에 없다

  const handlePostCardClick = async () => {
    await router.push(`/post/${title}`);
  }

  return (
    <div className={styles.container} onClick = { handlePostCardClick }>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.hashtagContainer}>
        {hashtag?.map((item: string) => {
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
