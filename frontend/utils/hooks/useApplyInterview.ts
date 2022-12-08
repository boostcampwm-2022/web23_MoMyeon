import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyInterview } from "../api/applyInterview";

const useApplyInterview = () => {
  const queryClient = useQueryClient();
  const { isLoading, mutate, isError, error, isSuccess } = useMutation(
    applyInterview,
    {
      /*onSuccess: () => {
      queryClient.invalidateQueries([""]);
    },*/
    }
  );

  return { isLoading, mutate, isError, error, isSuccess };
};

export { useApplyInterview };
