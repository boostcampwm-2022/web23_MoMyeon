import React, { useEffect } from "react";
import { useMemberQuery } from "utils/hooks/useInterviewQuery";
import { ResumeT } from "types/resume";
import Image from "next/image";
import user from "public/icon/user.png";
import styles from "styles/Interview.module.scss";
import { interviewUserSet } from "states/user";

function InterviewUser({ id }: { id: string }) {
  const { data, isLoading, error } = useMemberQuery({ id });
  const setCur = interviewUserSet();
  useEffect(() => {
    if (data !== undefined && data.length > 0) setCur(data[0].userId);
  }, [data, setCur]);

  if (isLoading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>에러</div>;
  }

  if (data.length === 0) {
    return <div>유저정보가 없습니다.</div>;
  }

  const onClickUser = (id: number) => {
    setCur(id);
  };
  return (
    <div className={styles.container}>
      {data?.map((item: ResumeT) => {
        const { userId, nickname } = item;
        return (
          <div
            onClick={() => onClickUser(userId)}
            className={styles.user}
            key={userId}
          >
            <Image src={user} width={60} height={60} alt="userIcon" />
            <div>{nickname}</div>
          </div>
        );
      })}
    </div>
  );
}

export default InterviewUser;
