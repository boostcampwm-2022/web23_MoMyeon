import { useQuery } from "@tanstack/react-query";
import getMangePost from "utils/api/getManagePost";

const useManagePost = () => {
  const { data, isLoading, error, isFetching } = useQuery(["managePost"], () =>
    getMangePost()
  );

  return { data, isLoading, error, isFetching };
};

export { useManagePost };
