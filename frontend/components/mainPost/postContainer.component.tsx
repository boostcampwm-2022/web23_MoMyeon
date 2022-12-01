import React, { useRef, useCallback } from "react";
import { Post } from "types/posts";
import PostCard from "./postCard.component";
import styles from "styles/PostCard.module.scss";
import useObserver from "utils/hooks/useObserver";
import useMainPost from "utils/hooks/useMainPost";

function PostContainer() {
  const bottom = useRef<null | HTMLDivElement>(null);

  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useMainPost();

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
