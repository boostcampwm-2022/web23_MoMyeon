import { useQuery } from "@tanstack/react-query";
import getAllCategory from "utils/api/getAllCategory";

const useCategoryQuery = () => {
  const { data } = useQuery(["categories"], () => getAllCategory());
  return data;
};

export { useCategoryQuery };
