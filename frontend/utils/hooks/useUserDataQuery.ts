import apiKeys from "constants/apiKeys";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useUserDataQuery = () => {
  const { data, isError, error } = useQuery(
    ["userData"],
    () => axios.get(apiKeys.GET_USER_INFO, { withCredentials: true }),
    { retry: false }
  );

  console.log(isError);

  return { data, isError, error };
};

export { useUserDataQuery };
