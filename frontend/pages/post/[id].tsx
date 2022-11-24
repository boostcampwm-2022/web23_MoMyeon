import React from "react";
import { GetServerSideProps, NextPage } from "next";
import { useState, useEffect } from "react";
// @ts-ignore
import isURL from "isurl";

import styles from "styles/PostPage.module.scss";
import Header from "components/header/header.component";
import PostPageHead from "head/postPage";
import { recruitingData } from "mockData/postPageData";
import { useRouter } from "next/router";
import { convertEpochStringToLocale } from "utils/dateFormmat";
import { InterviewJoinButton } from "../../components/button/interviewJoinButton";

interface Props {
  cookie: string | undefined;
  nickName: string;
  date: string;
  content: string[];
}

const PostPage: NextPage<Props> = ({ cookie, nickName, date, content }) => {
  const router = useRouter();
  const buttonAttributes = [
    { name: "참여자 관리", isVisible: true /* isHost */ },
    { name: "질문 관리", isVisible: true /* userState === 2 (참여자) */ },
    { name: "피드백", isVisible: false /* 모의 면접 종료 후 */ },
  ];

  const title = router.query.id;
  if (typeof title === "string") {
    recruitingData.title = title;
  }

  const [isContactURL, setIsContactURL] = useState(false);
  useEffect(() => {
    try {
      if (isURL(new URL(recruitingData.contact))) {
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
          <h2> {recruitingData.title} </h2>
          <div className={styles.titleInfoContainer}>
            <div className={styles.titleInfoCenter}>
              <span> {nickName}</span>
              <span> {date} </span>
            </div>
            <InterviewJoinButton initialUserState={0 /* userState */} />
          </div>
        </section>
        <section className={styles.postInfoContainer}>
          <ul>
            <li className={styles.postInfoLi}>
              <span> 카테고리 </span>
            </li>
            <li className={styles.postInfoLi}>
              <span> 신청 현황 </span>
              <div className={styles.textWrapper}>
                <h6 className={styles.mainText}> {recruitingData.member} </h6>
                <h6 className={styles.subText}> / </h6>
                <h6 className={styles.subText}> {recruitingData.maxMember} </h6>
              </div>
            </li>
            <li className={styles.postInfoLi}>
              <span> 연락 방법 </span>
              {isContactURL ? (
                <a href={recruitingData.contact}> {recruitingData.contact} </a>
              ) : (
                <p> {recruitingData.contact} </p>
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
          {content.map((line, index) => {
            return (
              <p key={index} className={styles.contents}>
                {" "}
                {line}{" "}
              </p>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  //API request
  const postID = context.query.id;
  const date = convertEpochStringToLocale(recruitingData.date);
  const content: string[] = recruitingData.content.split("\n");
  const nickName: string = "blind cat";

  const cookie = context.req.cookies.accessToken ?? null;

  return {
    props: {
      cookie,
      nickName,
      date,
      content,
    },
  };
};

export default PostPage;
