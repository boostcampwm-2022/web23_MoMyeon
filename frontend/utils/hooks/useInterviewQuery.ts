import apiKeys from "constants/apiKeys";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useQuestionQuery = ({ id }: { id: string }) => {
  const { data, isLoading, error, isFetching } = useQuery(
    ["question", id],
    () => axios.get(apiKeys.GET_INTERVIEW_QUESTIONS + `${id}`),
    { refetchOnWindowFocus: false, staleTime: 10000, refetchOnMount: false }
  );
  return { data: data?.data, isLoading, error, isFetching };
};

const useMemberQuery = ({ id }: { id: string }) => {
  const { data, isLoading, error, isFetching } = useQuery(
    ["member", id],
    () => axios.get(apiKeys.GET_INTERVIEW_MEMBERS + `${id}`),
    { refetchOnWindowFocus: false, staleTime: 10000, refetchOnMount: false }
  );
  return { data: data?.data.members, isLoading, error, isFetching };
};
export { useQuestionQuery, useMemberQuery };
