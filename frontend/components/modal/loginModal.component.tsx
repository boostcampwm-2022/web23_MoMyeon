import Modal from "react-modal";
import React from "react";
import styles from "styles/LoginModal.module.scss";
import Image from "next/image";
import modalExit from "public/icon/modalExit.png";
import github from "public/icon/github.png";
import { ViewProps, ModalProps } from "./loginModal";
import { loginModalState } from "states/loginModal";

Modal.setAppElement("div");

const LoginView = ({ setVisible }: ViewProps) => {
  const onClose = () => {
    setVisible(false);
  };
  const onGithubLogin = () => {
    const URL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GIT_ID}`;
    window.location.assign(URL);
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image
          onClick={onClose}
          className={styles.exit}
          src={modalExit}
          width={38}
          height={38}
          alt="modal exit"
        />
      </div>
      <h1 className={styles.welcome}>모면에 오신것을 환영합니다</h1>
      <Image
        onClick={onGithubLogin}
        className={styles.gitLogin}
        src={github}
        width={130}
        height={130}
        alt="github Login"
      />
      <h4 className={styles.loginText}>깃허브로그인</h4>
    </div>
  );
};

function LoginModal() {
  const [visible, setVisible] = loginModalState();
  const onCloseModal = () => {
    setVisible(false);
  };
  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      borderRadius: "12px",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "75rem",
      height: "45rem",
      border: "none",
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 4px",
      padding: 0,
    },
  };
  return (
    <Modal style={modalStyle} isOpen={visible} onRequestClose={onCloseModal}>
      <LoginView setVisible={setVisible} />
    </Modal>
  );
}

export default LoginModal;
