import { useQuery } from "@tanstack/react-query";
import getMyResume from "utils/api/getMyResume";
const useMyResumeQuery = () => {
  const { data, isLoading, error, isFetching } = useQuery(["myresume"], () =>
    getMyResume()
  );
  return { data, isLoading, error, isFetching };
};

export { useMyResumeQuery };
