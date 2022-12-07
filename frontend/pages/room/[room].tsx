import React, { Suspense } from "react";
import { GetServerSideProps } from "next";
import { usePreventBack } from "utils/hooks/usePreventBack";
import { MediasoupVideo } from "components/mediasoupVideo/mediasoupVideo.component";
import styles from "styles/room.module.scss";
import { useRouter } from "next/dist/client/compat/router";
import InterviewUser from "components/interviewUser/interviewUser.component";
import dynamic from "next/dynamic";
import { ToolBoxButton } from "components/button/toolBoxButton.component";
import { AudioToggleButton } from "components/button/audioToggleButton.component";
import { VideoToggleButton } from "components/button/videoToggleButton.component";

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

  const handleClickExitBtn = () => {
    if (window.confirm("나가시겠습니까?")) {
      router?.replace(`../post/${roomName}`);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.layout}>
        <div className={styles.mediaContainer}>
          <MediasoupVideo roomName={roomName} />
          <ToolBoxButton>
            <AudioToggleButton />
            <VideoToggleButton />
            <button> 면접자 역할 하기</button>
            <button> 면접관 역할 하기</button>
          </ToolBoxButton>
        </div>
        <div className={styles.utilContainer}>
          <InterviewUser id={"1"} />
          <div className={styles.resumeWrapper}>
            <Suspense fallback={<Loading />}>
              <Resume id={"1"} />
            </Suspense>
          </div>
          <div className={styles.questionWrapper}>
            <Suspense fallback={<Loading />}>
              <QAContainer id={"1"} />
            </Suspense>
          </div>
          <div className={styles.routerButtonContainer}>
            <button className={styles.feedbackBtn}> 피드백 가기 </button>
            <button className={styles.exitBtn} onClick={handleClickExitBtn}>
              {" "}
              나가기{" "}
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
