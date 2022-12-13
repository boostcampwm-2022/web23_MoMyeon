import { useQuery } from "@tanstack/react-query";
import getMyQuestion from "utils/api/myQuestion/getMyQuestion";

const useMyQuestionQuery = () => {
  const { data, isLoading, error, isFetching } = useQuery(["myquestion"], () =>
    getMyQuestion()
  );
  return { data, isLoading, error, isFetching };
};

export { useMyQuestionQuery };
