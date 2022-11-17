import { useRouter } from "next/router";
import { NextPage } from "next";

const PostPage : NextPage<void> = () =>  {
  const router = useRouter();
  console.log(router);

  return (
    <div> { router.pathname } </div>
  )
};

export default PostPage ;