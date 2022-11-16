import React, { useRef, useCallback } from "react";
import { Post } from "types/posts";
import PostCard from "./postCard.component";
import styles from "styles/PostCard.module.scss";
import useObserver from "utils/hooks/useObserver";
import { useInfiniteQuery } from "@tanstack/react-query";

import getPosts from "utils/api/getPosts";

function PostContainer() {
  const OFFSET = 10;
  const bottom = useRef<null | HTMLDivElement>(null);
  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
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
          data.pages.map((item: any, index: number) => {
            return item?.map((post: Post, outIndex: number) => {
              return (
                <PostCard
                  key={post.title + `${index}+${outIndex}`}
                  post={post}
                />
              );
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
