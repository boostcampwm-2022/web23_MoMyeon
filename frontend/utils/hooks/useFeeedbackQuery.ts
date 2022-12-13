import { useQuery } from "@tanstack/react-query";

import { getFeedback } from "utils/api/getFeedbacks";

const useFeedbackQuery = (id: string) => {
  const { data, isSuccess, isError } = useQuery(
    ["feedbacks" + id],
    () => getFeedback(id)
    /*{ refetchOnWindowFocus: false }*/
  );
  return { data, isSuccess, isError };
};

export { useFeedbackQuery };
