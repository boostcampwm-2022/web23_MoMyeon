import React from "react";
import { PostProp } from "types/posts";
import styles from "styles/PostCard.module.scss";
import userImage from "public/icon/user.png";
import Image from "next/image";
import { useRouter } from "next/router";
import {Category} from 'types/posts';

function PostCard({ post }: PostProp) {
  const {interview_id, title, category, maxMember } = post;
  const router = useRouter() ;

  //FIXME::
  // 문제:: title은 중복이 가능해서, 라우팅 정책 바꿔야 함,
  // 의견:: 데이터 요청할 때도 interview_id가 필요해서 interview_id로 하는 것이 좋아 보인다
  // 고려사항:: interview_id가 아직 API 설계에 없다

  const handlePostCardClick = () => {
    router.push(`/post/${interview_id}`);
  }

  return (
    <div className={styles.container} onClick = { handlePostCardClick }>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.hashtagContainer}>
        {category?.map((item:Category ) => {
          const {id, name} = item
          return (
            <h4 className={styles.hashtag} key={id}>
              {name}
            </h4>
          );
        })}
      </div>
      <div className={styles.footer}>
        <div className={styles.user}>
          <Image src={userImage} alt="user" width={30} height={30} />
        </div>
        <p>모집인원 {maxMember}</p>
      </div>
    </div>
  );
}

export default PostCard;
