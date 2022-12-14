import { Category } from "types/posts";
import React, { useCallback } from "react";
import BoxContainer from "components/boxContainer";
import styles from "styles/PostCardMypage.module.scss";
import { useRouter } from "next/router";
interface Props {
  id: number;
  title: string;
  category: Category[];
  status: number;
}
function CategoryComponent({ text }: { text: string }) {
  return <div className={styles.category}>#{text}</div>;
}

interface ButtonProps {
  text: string;
  active: boolean;
  onClick: () => void;
}
function Button({ text, onClick, active }: ButtonProps) {
  const onPressBtn = () => {
    if (active) {
      onClick();
    }
  };
  return (
    <button
      className={`${styles.button} ${!active && styles.inActive}`}
      onClick={onPressBtn}
    >
      {text}
    </button>
  );
}

function PostCard({ id, title, category, status }: Props) {
  const router = useRouter();
  const onClickStart = useCallback(() => {
    router.push(`/room/${id}`);
  }, []);
  const onClickManage = useCallback(() => {
    router.push(`/mypage/interview/${id}`);
  }, []);
  const onClickFeedback = useCallback(() => {
    router.push(`/mypage/feedback/${id}`);
  }, []);
  const onClickTitle = useCallback(() => {
    router.push(`/post/${id}`);
  }, []);

  const button = [
    {
      title: status === 1 ? "면접시작" : status === 2 ? "면접완료" : "면접대기",
      func: onClickStart,
      valid: true,
      active: status === 1,
    },
    {
      title: "질문관리",
      func: onClickManage,
      valid: status === 0,
      active: true,
    },
    {
      title: "피드백",
      func: onClickFeedback,
      valid: status === 2,
      active: true,
    },
  ];
  return (
    <BoxContainer width="60rem" height="10rem">
      <div className={styles.header}>
        <div className={styles.title} onClick={onClickTitle}>
          {title}
        </div>
        {category?.map((item) => {
          const { id, name } = item;
          return <CategoryComponent key={id} text={name} />;
        })}
      </div>
      <div className={styles.buttons}>
        {button?.map((item) => {
          const { title, func, valid, active } = item;
          return (
            valid && (
              <Button key={title} active={active} text={title} onClick={func} />
            )
          );
        })}
      </div>
    </BoxContainer>
  );
}

export default PostCard;
