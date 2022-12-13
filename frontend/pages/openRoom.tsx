import React from "react";
import styles from "styles/OpenRoom.module.scss";
import { OpenRoomVideo } from "components/mediasoupVideo/openRoomVideo.component";

export default function OpenRoom({ roomName }: any) {
  return (
    <div className={styles.background}>
      <div className={styles.mediaContainer}>
        <OpenRoomVideo roomName={roomName} />
      </div>
    </div>
  );
}
