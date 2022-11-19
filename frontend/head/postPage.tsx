import Head from "next/head";
import React from "react";
import { MetaData } from "types/headMetaData";

//TODO:: 데이터 있는 것만 meta 항목 만들기
function PostPageHead(metaData: MetaData) {
  return (
    <Head>
      <title>모두의 면접</title>
    </Head>
  );
}

export default PostPageHead;
