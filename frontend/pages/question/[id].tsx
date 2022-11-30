import React, { Suspense, useState } from "react";
import QAPair from "components/question/qaPair";
import Resume from "components/resume/resume.compoent";
import { GetServerSideProps } from "next";
import QAContainer from "components/question/qaContainer";

const data = {
  questions: [
    {
      userId: 3,
      userName: "테스터1",
      question: [
        {
          type: 1,
          id: 2,
          contents: "HTTP 프로토콜에 대해 설명해주세요.",
          feedback: "",
        },
        {
          type: 1,
          id: 5,
          contents: "OSI 7 계층에 대해 설명해주세요.",
          feedback: "",
        },
        {
          type: 1,
          id: 8,
          contents: "UDP, TCP의 차이점은 무엇인가요?",
          feedback: "",
        },
      ],
    },
    {
      userId: 4,
      userName: "테스터2",
      question: [
        {
          type: 1,
          id: 2,
          contents: "HTTP 프로토콜에 대해 설명해주세요.",
          feedback: "",
        },
        {
          type: 1,
          id: 5,
          contents: "OSI 7 계층에 대해 설명해주세요.",
          feedback: "",
        },
        {
          type: 1,
          id: 8,
          contents: "UDP, TCP의 차이점은 무엇인가요?",
          feedback: "",
        },
      ],
    },
  ],
};

const userdata = {
  members: [
    {
      userId: 3,
      nickname: "userA",
      resume: [
        {
          title: "프로젝트 경험",
          content: "무브트럭(2017) \n 이삿짐을 선택하면...",
        },
        {
          title: "활동",
          content: "네이버 부스트캠프 7기",
        },
      ],
    },
    {
      userId: 4,
      nickname: "userB",
      resume: [
        {
          title: "프로젝트 경험",
          content: "무브트럭(2017) \n 이삿짐을 선택하면...",
        },
        {
          title: "활동",
          content: "네이버 부스트캠프 7기",
        },
      ],
    },
  ],
};

function TempQuestion({ postId }: { postId: string }) {
  const [cur, setCur] = useState(0);
  return (
    <>
      <Suspense fallback={"<div>로딩중</div>"}>
        <QAContainer cur={cur} id={postId} />
      </Suspense>
      <Suspense fallback={"<div>로딩중</div>"}>
        <Resume cur={cur} id={postId} />
      </Suspense>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postId = context.query.id;
  return {
    props: {
      postId,
    },
  };
};

export default TempQuestion;
