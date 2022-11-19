import React from "react";
import {GetServerSideProps, NextPage} from "next";
import {useState, useEffect} from "react";
// @ts-ignore
import isURL from 'isurl';


import styles from "styles/PostPage.module.scss";
import Header from "components/header/header.component";
import PostPageHead from "head/postPage";
import { recruitingData } from "mockData/postPageData";
import {useRouter} from "next/router" ;
import {Cookie} from "types/auth";
import {convertEpochStringToLocale} from "utils/convertEpochStringToLocale";

interface Props {
  cookie : string | undefined,
  nickName : string,
  date : string,
  content: string[],
}

const PostPage : NextPage<Props> = ({ cookie, nickName, date, content }) =>  {

  const router = useRouter();

  const title = router.query.id ;
  if(typeof title === 'string'){
    recruitingData.title = title ;
  }

  const [isContactURL, setIsContactURL] = useState(false);
  useEffect(()=>{
    try {
      if(isURL(new URL(recruitingData.contact))){
        setIsContactURL(true);
      }
    } catch {
    }
  },[])

  return (
    <div className={styles.postPageContainer}>
      <PostPageHead/>
      <Header/>
      <div className={styles.postContainer}>
        <section className={styles.titleContainer}>
          <h2> { recruitingData.title } </h2>
          <div className={styles.titleInfoContainer}>
            <div className ={styles.titleInfoCenter}>
              <span> { nickName }</span>
              <span> { date } </span>
            </div>
            <button className={styles.postPageButton}> 신청중 </button>
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
              {isContactURL
                ? <a href={recruitingData.contact}> {recruitingData.contact } </a>
                : <p> {recruitingData.contact } </p>
              }
            </li>
          </ul>
          <ul>
            <li className={styles.postButtonLi}>
              <button className={styles.postPageButton}> 참여자 관리 </button>
            </li>
            <li className={styles.postButtonLi}>
              <button className={styles.postPageButton}> 질문 관리 </button>
            </li>
            <li className={styles.postButtonLi}>
              <button className={styles.postPageButton}> 피드백 </button>
            </li>
          </ul>
        </section>
        <section >
          <div className={styles.titleContainer}>
            <h4> 상세 내용 </h4>
          </div>
          { content.map((line, index)=> {
            return <p key={index} className={styles.contents}> {line} </p>
          })}
        </section>
      </div>
    </div>
  )
};

export const getServerSideProps: GetServerSideProps = async (context) => {

  //API request
  const postID = context.query.id ;
  const date = convertEpochStringToLocale(recruitingData.date);
  const content : string[] = recruitingData.content.split('\n');
  //헤더에서 가져오기
  const nickName : string = 'blind cat'

  const cookie = context.req.cookies.auth ? context.req.cookies.auth : null;
  return {
    props: {
      cookie,
      nickName,
      date,
      content,
    },
  };
};

export default PostPage ;