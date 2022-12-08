import { Category } from "types/posts";
import React, { useCallback } from "react";
import BoxContainer from "components/boxContainer";
import styles from "styles/PostCardMypage.module.scss";
import { useRouter } from "next/router";
interface Props {
  id: number;
  title: string;
  category: Category[];
}
function CategoryComponent({ text }: { text: string }) {
  return <div className={styles.category}>#{text}</div>;
}

interface ButtonProps {
  text: string;
  onClick: () => void;
}
function Button({ text, onClick }: ButtonProps) {
  return (
    <button className={styles.button} onClick={onClick}>
      {text}
    </button>
  );
}

function PostCard({ id, title, category }: Props) {
  const router = useRouter();
  const onClickStart = useCallback(() => {
    router.push(`/room/${id}`);
  }, []);
  const onClickManage = useCallback(() => {
    router.push(`/mypage/interview/${id}`);
  }, []);
  const onClickFeedback = useCallback(() => {
    console.log("feedback");
  }, []);

  const button = [
    { title: "면접시작", func: onClickStart },
    { title: "질문관리", func: onClickManage },
    { title: "피드백", func: onClickFeedback },
  ];

  return (
    <BoxContainer width="60rem" height="10rem">
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        {category?.map((item) => {
          const { id, name } = item;
          return <CategoryComponent key={id} text={name} />;
        })}
      </div>
      <div className={styles.buttons}>
        {button?.map((item) => {
          const { title, func } = item;
          return <Button text={title} onClick={func} />;
        })}
      </div>
    </BoxContainer>
  );
}

export default PostCard;
