import React, { Suspense, useState } from "react";
import { GetServerSideProps } from "next";
import { usePreventBack } from "utils/hooks/usePreventBack";
import { MediasoupVideo } from "components/mediasoupVideo/mediasoupVideo.component";
import styles from "styles/room.module.scss";
import { useRouter } from "next/dist/client/compat/router";
import InterviewUser from "components/interviewUser/interviewUser.component";
import dynamic from "next/dynamic";
import postFeedback from "utils/api/feedbackCreate/postFeedback";
import { usePostPageStatusCheck } from "utils/hooks/usePostPageStatus/usePostPageStatusCheck";

const QAContainer = dynamic(
  () => import("components/question/qaContainer.component"),
  {
    ssr: false,
  }
);
const Resume = dynamic(() => import("components/resume/resume.component"), {
  ssr: false,
});
const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      로딩중
    </div>
  );
};

export default function Room({ roomName }: any) {
  //뒤로 가기 버튼 막기
  //뒤로 가기 때문에 연결이 끊기면 불편할 것 같아서 추가
  usePreventBack();
  const router = useRouter();
  const [isLeft, setIsLeft] = useState(false);
  const [isHost, _] = usePostPageStatusCheck(roomName);
  const handleClickExitBtn = () => {
    if (window.confirm("나가시겠습니까?")) {
      setIsLeft(true);
      router?.replace(`../post/${roomName}`);
    }
  };

  const handleFeedbackBtn = () => {
    if (isHost) {
      postFeedback({ roomId: roomName });
    }
    window.localStorage.clear();
  };

  return (
    <div className={styles.background}>
      <div className={styles.layout}>
        <div className={styles.mediaContainer}>
          <MediasoupVideo roomName={roomName} isLeft={isLeft} />
        </div>
        <div className={styles.utilContainer}>
          <InterviewUser id={roomName} />
          <div className={styles.resumeWrapper}>
            <Suspense fallback={<Loading />}>
              <Resume id={roomName} />
            </Suspense>
          </div>
          <div className={styles.questionWrapper}>
            <Suspense fallback={<Loading />}>
              <QAContainer id={roomName} />
            </Suspense>
          </div>
          <div className={styles.routerButtonContainer}>
            <button onClick={handleFeedbackBtn} className={styles.feedbackBtn}>
              {" "}
              피드백 가기{" "}
            </button>
            <button className={styles.exitBtn} onClick={handleClickExitBtn}>
              나가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const roomName = context.query.room;

  return {
    props: {
      roomName,
    },
  };
};
