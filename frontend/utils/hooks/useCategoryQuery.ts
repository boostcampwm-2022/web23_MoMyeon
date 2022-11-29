import apiKeys from "constants/apiKeys";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useCategoryQuery = () => {
  const { data } = useQuery(["categories"], () =>
    //axios.get(apiKeys.GET_CATEGORIES)
    axios.get(apiKeys.GET_CATEGORIES)
  );
  return data?.data.category;
};

export { useCategoryQuery };
