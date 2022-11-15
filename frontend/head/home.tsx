import Head from "next/head";

import React from "react";

function HomeHead() {
  return (
    <Head>
      <title>모두의 면접</title>
      <meta
        name="description"
        content="모두가 쉽게 모의 면접을 모집하고 화상채팅 기능을 통해 모의면접을 실시한다"
      />
      <meta
        name="keywords"
        content="면졉, 모의면접, interview, 코딩, IT, IT기업, 네이버, 카카오, 라인"
      />
      <meta name="og:site_name" content="모두의 면접" />
      <meta name="og:title" content="IT기업 모의 면접" />
      <meta
        name="og:description"
        content="모두가 쉽게 모의 면접을 모집하고 화상채팅 기능을 통해 모의면접을 실시한다"
      />
      <meta name="og:type" content="website" />
    </Head>
  );
}

export default HomeHead;
