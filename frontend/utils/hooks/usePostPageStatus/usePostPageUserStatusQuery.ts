import { useQuery } from "@tanstack/react-query";
import { getPostPageUserStatus } from "utils/api/getPostPageUserstatus";

const usePostPageUserStatusQuery = (id: string | undefined) => {
  if (!id) {
    return { error: "post id 가 없습니다." };
  }

  const { data, isLoading, error, isError, isFetching, isSuccess } = useQuery(
    [`postPageStatus${id}`],
    () => getPostPageUserStatus(id),
    { retry: false }
  );

  return { data, isLoading, error, isError, isFetching, isSuccess };
};

export { usePostPageUserStatusQuery };
