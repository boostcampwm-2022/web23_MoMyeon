import { useQuery } from "@tanstack/react-query";
import getManageQuestion from "utils/api/ManageQuestion/getManageQuestion";
const useManageQuestionQuery = ({ id }: { id: string }) => {
  const { data, isLoading, error, isFetching } = useQuery(
    ["manageQuestion", id],
    () => getManageQuestion(id)
  );
  return { data, isLoading, error, isFetching };
};

export { useManageQuestionQuery };
