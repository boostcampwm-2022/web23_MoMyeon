import { useQuery } from "@tanstack/react-query";
import getMember from "utils/api/getMember";
import getQuestion from "utils/api/getQuestion";
const useQuestionQuery = ({ id }: { id: string }) => {
  const { data, isLoading, error, isFetching } = useQuery(
    ["question", id],
    () => getQuestion(id),
    { refetchOnWindowFocus: false, staleTime: 10000, refetchOnMount: false }
  );
  return { data, isLoading, error, isFetching };
};

const useMemberQuery = ({ id }: { id: string }) => {
  const { data, isLoading, error, isFetching } = useQuery(
    ["member", id],
    () => getMember(id),
    { refetchOnWindowFocus: false, staleTime: 10000, refetchOnMount: false }
  );
  return { data, isLoading, error, isFetching };
};
export { useQuestionQuery, useMemberQuery };
