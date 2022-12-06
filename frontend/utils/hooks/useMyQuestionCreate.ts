import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import createMyQuestion from "utils/api/createMyQuestion";

const useMyQuestionCreate = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, mutate } = useMutation(createMyQuestion, {
    onSettled: () => {
      queryClient.invalidateQueries(["myquestion"]);
    },
  });

  return { data, isLoading, error, mutate };
};

export { useMyQuestionCreate };
