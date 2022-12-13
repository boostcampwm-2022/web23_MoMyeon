import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteMyQuestion from "utils/api/myQuestion/deleteMyQuestion";

const useMyQuestionDelete = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, mutate } = useMutation(deleteMyQuestion, {
    onSettled: () => {
      queryClient.invalidateQueries(["myquestion"]);
    },
  });

  return { data, isLoading, error, mutate };
};

export { useMyQuestionDelete };
