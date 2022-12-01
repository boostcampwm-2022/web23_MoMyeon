import React from "react";
import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
// @ts-ignore
import isURL from "isurl";
import styles from "styles/PostPage.module.scss";
import Header from "components/header/header.component";
import PostPageHead from "head/postPage";
import { useRouter } from "next/router";
import { InterviewJoinButton } from "components/button/interviewJoinButton";
import { PostData } from "types/posts";
import getPostById from "utils/api/getPostById";
const PostPage = ({ postData }: { postData: PostData | null }) => {
  const router = useRouter();

  useEffect(() => {
    if (postData === null) {
      router.replace("/");
    }
  }, []);

  const buttonAttributes = [
    {
      name: "참여자 관리",
      isVisible: true /* isHost */,
      /* postData?.isHost ?? false */
    },
    {
      name: "질문 관리",
      isVisible: true,
      /* postData?.userStatus !== undefined && postData?.userStatus === 2, */
      /* userStatus === 2 => 승인 */
    },
    {
      name: "피드백",
      isVisible: true,
      /* postData?.recruitStatus !== undefined && postData?.recruitStatus === 1,*/
      /* 모의 면접 종료 후 */
    },
  ];

  const [isContactURL, setIsContactURL] = useState(false);
  useEffect(() => {
    try {
      if (postData?.contact && isURL(new URL(postData?.contact))) {
        setIsContactURL(true);
      }
    } catch {}
  }, []);

  return (
    <div className={styles.postPageContainer}>
      <PostPageHead />
      <Header />
      <div className={styles.postContainer}>
        <section className={styles.titleContainer}>
          <h2> {postData?.title} </h2>
          <div className={styles.titleInfoContainer}>
            <div className={styles.titleInfoCenter}>
              <span> {postData?.host}</span>
              <span> {postData?.date} </span>
            </div>
            <InterviewJoinButton initialUserState={postData?.userStatus ?? 0} />
          </div>
        </section>
        <section className={styles.postInfoContainer}>
          <ul>
            <li className={styles.postInfoLi}>
              <span> 카테고리 </span>
              <div className={styles.categoryContainer}>
                {postData?.category.map((item) => {
                  return (
                    <div className={styles.categoryItem} key={item.id}>
                      {" "}
                      {item.name}{" "}
                    </div>
                  );
                })}
              </div>
            </li>
            <li className={styles.postInfoLi}>
              <span> 신청 현황 </span>
              <div className={styles.textWrapper}>
                <h6 className={styles.mainText}> {postData?.member} </h6>
                <h6 className={styles.subText}> / </h6>
                <h6 className={styles.subText}> {postData?.maxMember} </h6>
              </div>
            </li>
            <li className={styles.postInfoLi}>
              <span> 연락 방법 </span>
              {isContactURL ? (
                <a href={postData?.contact}> {postData?.contact} </a>
              ) : (
                <p> {postData?.contact} </p>
              )}
            </li>
          </ul>
          <ul>
            {buttonAttributes?.map((attribute) => {
              if (!attribute.isVisible) {
                return;
              }
              return (
                <li className={styles.postButtonLi} key={attribute.name}>
                  <button className={styles.postPageButton}>
                    {" "}
                    {attribute.name}{" "}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          <div className={styles.titleContainer}>
            <h4> 상세 내용 </h4>
          </div>
          {postData?.content.map((line, index) => {
            return (
              <p key={index} className={styles.contents}>
                {line}
              </p>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postID = context.query.id;

  //서버에서 리다이렉트 해주면 알림 메시지 주기 어려울 수 있다.
  //클라이언트에서 리다이렉트 하면 알림 메시지 줄 수 있지만, 불필요한 렌더링이 있을 수 있다.
  if (typeof postID !== "string") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const postData = await getPostById(postID);
  if (postData === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      postData,
    },
  };
};

export default PostPage;
