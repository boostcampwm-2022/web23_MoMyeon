import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteManageQuestion from "utils/api/manageQuestion/deleteManageQuestion";
const useManageQuestionDelete = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, mutate } = useMutation(deleteManageQuestion, {
    onSettled: () => {
      queryClient.invalidateQueries(["manageQuestion"]);
    },
  });

  return { data, isLoading, error, mutate };
};

export { useManageQuestionDelete };
