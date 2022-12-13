import { useQuery } from "@tanstack/react-query";
import getUserInfo from "utils/api/getUserInfo";
const useUserDataQuery = () => {
  const { data, isLoading, isError, error, isSuccess } = useQuery(
    ["userData"],
    () => getUserInfo(),
    { retry: false }
  );

  return { data, isLoading, isError, error, isSuccess };
};

export { useUserDataQuery };
