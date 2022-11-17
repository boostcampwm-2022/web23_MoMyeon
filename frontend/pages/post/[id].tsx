import { useRouter } from "next/router";
import {GetServerSideProps, NextPage} from "next";
import {Cookie} from "types/auth";
import Header from "components/header/header.component";

const PostPage : NextPage<Cookie> = ({ cookie }) =>  {
  const router = useRouter();
  console.log(router);

  return (
    <div>
      <Header cookie={cookie}/>
    </div>
  )
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = context.req.cookies.auth ? context.req.cookies.auth : null;
  return {
    props: {
      cookie,
    },
  };
};

export default PostPage ;