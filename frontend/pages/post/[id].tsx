import React from "react";
import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import validator from "validator";
import styles from "styles/PostPage.module.scss";
import Header from "components/header/header.component";
import PostPageHead from "head/postPage";
import { useRouter } from "next/router";
import { InterviewJoinButtonComponent } from "components/button/interviewJoinButton.component";
import { PostData } from "types/posts";
import getPostById from "utils/api/getPostById";
import { PostDeleteButton } from "components/button/postDeleteButton.component";
import { usePostPageStatusCheck } from "utils/hooks/usePostPageStatus/usePostPageStatusCheck";
import { InterviewManageButton } from "components/button/interviewManageButton.component";
import { PostPageApplyList } from "../../components/postPageApplyList/postPageApplyList";
import postPage from "head/postPage";

const PostPage = ({ postData }: { postData: PostData | null }) => {
  const router = useRouter();

  useEffect(() => {
    if (postData === null) {
      router.replace("/");
    }
  }, []);

  const [curMember, setCurMember] = useState(postData?.member);
  const [isHost, userStatus] = usePostPageStatusCheck(postData?.postId);

  const [isContactURL, setIsContactURL] = useState(false);
  useEffect(() => {
    try {
      if (
        postData?.contact &&
        validator.isURL(postData.contact, { require_protocol: true })
      ) {
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
              <span className={styles.date}> {postData?.date} </span>
            </div>
            <InterviewJoinButtonComponent
              setCurMember={setCurMember}
              isHost={isHost}
              userStatus={userStatus}
              postId={postData?.postId}
            />
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
              <PostPageApplyList
                id={postData?.postId}
                curMember={curMember}
                maxMember={postData?.maxMember}
              />
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
            <InterviewManageButton
              id={postData?.postId}
              userStatus={userStatus}
            />
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
        {isHost && (
          <section>
            <PostDeleteButton id={postData?.postId} />
          </section>
        )}
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
