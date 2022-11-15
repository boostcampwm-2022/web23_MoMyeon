import styles from '../../styles/Create.module.css'
//@ts-ignore
import MockHeader from "../../components/mockHeader.component.tsx";
import React from "react";
import CreatePostForm from "../../components/createPostForm.component";

export default function Create(){


  return(
    <div>
      <MockHeader/>
      <div className={styles.createContainer}>
        <div className={styles.titleWrapper}>
          <h2>
            모의 면접 모집
          </h2>
        </div>
        <CreatePostForm/>
      </div>
    </div>
  );
}
