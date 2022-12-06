import React from "react";
import Image from "next/image";
import styles from "styles/Header.module.scss";
import logo from "public/icon/logo.png";
import Link from "next/link";
import LoginModal from "components/modal/loginModal.component";
import DropDown from "./dropDown";
import dropDown from "public/icon/dropDown.png";
import { ImageInfo } from "./header";
import { loginModalSet } from "states/loginModal";
import { useUserDataQuery } from "utils/hooks/useUserDataQuery";
import { UserData } from "types/auth";

function Header() {
  const setVisible = loginModalSet();

  const { data, isError, error } = useUserDataQuery();
  const userData: UserData = { profile: null, nickname: null };
  userData.nickname = data?.data.profile;
  userData.profile = data?.data.nickname;

  if (!isError) {
    userData.nickname = data?.data.nickname;
    userData.profile = data?.data.profile;
  }

  const userImage = userData.profile ?? "";
  const onClickLogin = () => {
    setVisible(true);
  };
  const loginImage = [
    { style: styles.userIcon, src: userImage, w: 38, h: 38, alt: "user" },
    { style: styles.dropDown, src: dropDown, w: 48, h: 48, alt: "dropDown" },
  ];
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logoContainer}>
        <Image width={65} height={65} src={logo} alt="logo" />
        <h1 className={styles.logoText}>모면</h1>
      </Link>
      <div className={styles.menuContainer}>
        {userData.nickname ? (
          <Link href="/post/create">
            <div className={styles.menuText}>모의면접 모집</div>
          </Link>
        ) : (
          <div onClick={onClickLogin}>
            <div className={styles.menuText}>모의면접 모집</div>
          </div>
        )}

        {userData.nickname ? (
          <DropDown>
            <div className={styles.loginBox}>
              {loginImage.map((item: ImageInfo) => {
                const { style, src, w, h, alt } = item;
                return (
                  <Image
                    key={alt}
                    className={style}
                    src={src}
                    width={w}
                    height={h}
                    alt={alt}
                  />
                );
              })}
            </div>
          </DropDown>
        ) : (
          <div onClick={onClickLogin} className={styles.menuText}>
            로그인
          </div>
        )}
      </div>
      <LoginModal />
    </div>
  );
}

export default Header;
