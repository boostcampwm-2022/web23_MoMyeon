import styles from "styles/PostPage.module.scss";
import React, { useEffect, useState } from "react";
import getMember from "utils/api/getMember";

const PostPageApplyList = ({
  id,
  curMember,
  maxMember,
}: {
  id: string | undefined;
  curMember: number | undefined;
  maxMember: number | undefined;
}) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const setData = async () => {
      if (id) {
        const data = await getMember(id);
        setMembers(
          data?.map((elem: any) => {
            return elem.nickname;
          })
        );
      }
    };
    setData();
  }, [curMember]);

  return (
    <>
      <span> 신청 현황 </span>
      <div className={styles.textWrapper}>
        <h6 className={styles.mainText}> {curMember} </h6>
        <h6 className={styles.subText}> / </h6>
        <h6 className={styles.subText}> {maxMember} </h6>
        <div className={styles.nickNameContainer}>
          {members?.map((elem, idx) => {
            return (
              <text className={styles.nickName} key={idx}>
                {" "}
                {elem}{" "}
              </text>
            );
          })}
        </div>
      </div>
    </>
  );
};

export { PostPageApplyList };
