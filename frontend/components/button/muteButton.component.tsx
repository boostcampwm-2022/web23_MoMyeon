import styles from "styles/room.module.scss";
import React, { useState } from "react";

interface MuteButtonProps {
  onClickBtn: Function;
  name: string;
}

const MuteButton = ({ onClickBtn, name }: MuteButtonProps) => {
  const [muted, setMuted] = useState(false);

  return (
    <button
      className={`${muted ? styles.muteButtonMuted : styles.muteButton}`}
      onClick={() => {
        onClickBtn();
        setMuted((prev) => !prev);
      }}
    >
      {name}
    </button>
  );
};

export { MuteButton };
