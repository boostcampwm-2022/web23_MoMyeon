import React from "react";
import Image from "next/image";
import styles from "styles/Header.module.scss";
import logo from "public/icon/logo.png";
import Link from "next/link";
import { Props } from "./header";
import dropDown from "public/icon/dropDown.png";
import loginUser from "public/icon/loginUser.png";
import { ImageInfo } from "./header";
import DropDown from "./dropDown";

function Header({ setVisible, cookie }: Props) {
  const onClickLogin = () => {
    setVisible(true);
  };
  const loginImage = [
    { style: styles.dropDown, src: dropDown, w: 48, h: 48, alt: "dropDown" },
    { style: styles.userIcon, src: loginUser, w: 28, h: 28, alt: "user" },
  ];
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logoContainer}>
        <Image width={65} height={65} src={logo} alt="logo" />
        <h1 className={styles.logoText}>모면</h1>
      </Link>
      <div className={styles.menuContainer}>
        <div className={styles.menuText}>모의면접 모집</div>
        {cookie ? (
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
    </div>
  );
}

export default Header;
