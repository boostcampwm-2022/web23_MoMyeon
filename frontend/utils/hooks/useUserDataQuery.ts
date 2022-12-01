import apiKeys from "constants/apiKeys";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useUserDataQuery = () => {
  const { data, isLoading, isError, error } = useQuery(
    ["userData"],
    () =>
      axios
        .get(apiKeys.GET_USER_INFO, { withCredentials: true })
        .catch((error) => {}),
    { retry: false }
  );

  return { data, isLoading, isError, error };
};

export { useUserDataQuery };
