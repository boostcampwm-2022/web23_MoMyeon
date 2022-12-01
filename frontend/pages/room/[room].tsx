import React from "react";
import { GetServerSideProps } from "next";
import { usePreventBack } from "utils/hooks/usePreventBack";
import { MediasoupVideo } from "components/mediasoupVideo/mediasoupVideo.component";
import styles from "styles/room.module.scss";

export default function Room({ roomName }: any) {
  //뒤로 가기 버튼 막기
  //뒤로 가기 때문에 연결이 끊기면 불편할 것 같아서 추가
  usePreventBack();

  return (
    <div className={styles.background}>
      <MediasoupVideo roomName={roomName} />
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
