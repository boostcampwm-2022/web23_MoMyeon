import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "utils/api/deletePost";

const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, mutate, isSuccess } = useMutation(
    deletePost,
    {
      /*
    onSettled: () => {
      queryClient.invalidateQueries(["myquestion"]);
    },*/
    }
  );

  return { data, isLoading, error, mutate, isSuccess };
};

export { useDeletePost };
