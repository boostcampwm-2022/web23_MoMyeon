import Head from "next/head";
import React from "react";
import { PostData } from "types/posts";
import { Category } from "types/posts";
//TODO:: 데이터 있는 것만 meta 항목 만들기
function PostPageHead({ postData }: { postData: PostData | null }) {
  if (!postData) {
    return null;
  }
  const { title, content, category } = postData;

  const ArrToString = (arr: string[]) => {
    return arr.join(",");
  };

  const CategoryToString = (arr: Category[]) => {
    return arr.map((item) => item.name).join(",");
  };
  return (
    <Head>
      <title>{postData?.title}</title>
      <meta name="description" content={title} />
      <meta name="keywords" content={CategoryToString(category)} />
      <meta name="og:site_name" content="모두의 면접" />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={ArrToString(content)} />
      <meta name="og:type" content="website" />
    </Head>
  );
}

export default PostPageHead;
