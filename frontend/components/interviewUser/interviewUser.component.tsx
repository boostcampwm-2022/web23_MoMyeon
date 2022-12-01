import React, { useEffect } from "react";
import { useMemberQuery } from "utils/hooks/useInterviewQuery";
import { ResumeT } from "types/resume";
import Image from "next/image";
import user from "public/icon/user.png";
import styles from "styles/Interview.module.scss";
import { interviewUser } from "states/user";
import { useRecoilState } from "recoil";

function InterviewUser({ id }: { id: string }) {
  const { data } = useMemberQuery({ id });
  const [_, setCur] = useRecoilState(interviewUser);

  useEffect(() => {
    if (data && data.length > 0) setCur(data[0].userId);
    console.log(data);
  }, [data]);

  if (data === undefined) {
    return <div>loading</div>;
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
