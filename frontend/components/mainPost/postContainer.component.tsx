import React, { useRef, useCallback } from "react";
import { Post } from "types/posts";
import PostCard from "./postCard.component";
import styles from "styles/PostCard.module.scss";
import useObserver from "utils/hooks/useObserver";
import { useInfiniteQuery } from "@tanstack/react-query";
import { categoryArray } from "states/categoryArray";
import { useRecoilValue } from "recoil";
import getPosts from "utils/api/getPosts";

function PostContainer() {
  const OFFSET = 18;
  const bottom = useRef<null | HTMLDivElement>(null);

  const categoryArr = useRecoilValue(categoryArray);

  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["posts", ...categoryArr],
    queryFn: ({ pageParam }) =>
      getPosts({ pageParam, category: categoryArr, search: "" }),
    getNextPageParam: (lastPage, page) => {
      return lastPage.length === OFFSET ? page.length : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const onIntersect: IntersectionObserverCallback = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (!hasNextPage) return;
      return entry.isIntersecting && fetchNextPage();
    },
    [hasNextPage, fetchNextPage]
  );

  useObserver({ target: bottom, onIntersect });

  if (status === "loading") return <p>불러오는 중</p>;
  if (status === "error") return <p>에러</p>;
  return (
    <div>
      <div className={styles.outerContainer}>
        {data?.pages &&
          data.pages?.map((item: any) => {
            return item?.map((post: Post) => {
              const { interview_id: id } = post;
              return <PostCard key={id} post={post} />;
            });
          })}
      </div>
      <div ref={bottom}>
        {isFetching && !isFetchingNextPage ? "Fetching..." : null}
      </div>
    </div>
  );
}

export default PostContainer;
