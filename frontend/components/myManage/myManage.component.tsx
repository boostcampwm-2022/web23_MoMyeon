import React from "react";
import Participant from "./participant.component";
import Host from "./host.component";
import styles from "styles/MyManage.module.scss";
import { useManagePost } from "utils/hooks/useManagePost";

function MyManage() {
  const { data, isLoading } = useManagePost();
  if (isLoading || !data) {
    return <div>로딩중</div>;
  }

  const { host, guest } = data;
  return (
    <div className={styles.container}>
      <div className={styles.postContainer}>
        <Host data={host} />
      </div>
      <div className={styles.postContainer}>
        <Participant data={guest} />
      </div>
    </div>
  );
}

export default MyManage;
