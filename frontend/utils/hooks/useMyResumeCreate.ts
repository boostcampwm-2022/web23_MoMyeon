import { useMutation, useQueryClient } from "@tanstack/react-query";
import createMyResume from "utils/api/createMyResume";
const useMyResumeCreate = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, mutate } = useMutation(createMyResume, {
    onSettled: () => {
      queryClient.invalidateQueries(["myresume"]);
    },
  });
  return { data, isLoading, error, mutate };
};

export { useMyResumeCreate };
