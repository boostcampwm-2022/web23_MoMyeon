import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyInterview } from "../api/applyInterview";

const useApplyInterview = ({ id }: { id: string | undefined }) => {
  const queryClient = useQueryClient();
  const { isLoading, mutate, isError, error, isSuccess } = useMutation(
    applyInterview,
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`postPageStatus${id}`]);
      },
    }
  );

  return { isLoading, mutate, isError, error, isSuccess };
};

export { useApplyInterview };
