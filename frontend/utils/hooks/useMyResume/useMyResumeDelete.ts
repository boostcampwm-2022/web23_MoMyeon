import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteMyResume from "utils/api/deleteMyResume";
const useMyResumeDelete = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, mutate } = useMutation(deleteMyResume, {
    onSettled: () => {
      queryClient.invalidateQueries(["myresume"]);
    },
  });

  return { data, isLoading, error, mutate };
};

export { useMyResumeDelete };
