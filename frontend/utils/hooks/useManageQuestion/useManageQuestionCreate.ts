import { useMutation, useQueryClient } from "@tanstack/react-query";
import createManageQuestion from "utils/api/ManageQuestion/createManageQuestion";
const useManageQuestionCreate = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, mutate } = useMutation(createManageQuestion, {
    onSettled: () => {
      queryClient.invalidateQueries(["manageQuestion"]);
    },
  });

  return { data, isLoading, error, mutate };
};

export { useManageQuestionCreate };
