import styles from "styles/PostPage.module.scss";
import React, { useState, useEffect } from "react";
import { useDeletePost } from "../../utils/hooks/useDeletePost";
import { useRouter } from "next/router";

const PostDeleteButton = ({ id }: { id: string | undefined }) => {
  const { mutate, isSuccess } = useDeletePost();
  const router = useRouter();

  const handleDeleteClick = () => {
    if (window.confirm()) {
      if (id) {
        mutate(id);
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const goMain = async () => {
        await router.replace("/");
      };
      goMain();
    }
  }, [isSuccess]);

  return (
    <button className={styles.deleteButton} onClick={handleDeleteClick}>
      삭제하기
    </button>
  );
};

export { PostDeleteButton };
