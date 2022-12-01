import { useInfiniteQuery } from "@tanstack/react-query";
import { categoryArraySorted } from "states/categoryArray";
import { useRecoilValue } from "recoil";
import getPosts from "utils/api/getPosts";

export default function useMainPost() {
  const categoryArr = useRecoilValue(categoryArraySorted);
  const OFFSET = 18;
  console.log(categoryArr);
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
    staleTime: 2000,
  });

  return {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  };
}
