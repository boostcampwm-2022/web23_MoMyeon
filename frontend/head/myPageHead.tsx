import Head from "next/head";

function MyPageHead({ title }: { title: string }) {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}

export default MyPageHead;
