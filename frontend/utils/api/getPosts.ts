import apiKeys from "constants/apiKeys";
import axios from "axios";
async function getPosts({
  pageParam = 0,
  category = [],
  search = "",
}: {
  pageParam: number;
  category: number[] | string;
  search: string;
}) {
  const categoryToURI =
    category?.length == 0 ? "" : encodeURIComponent(JSON.stringify(category));
  const req = await axios.get(
    apiKeys.GET_POSTS +
      `category=${categoryToURI}&search=${search}&page=${pageParam}`
  );
  const data = await req.data.interviews;

  return data;
}

export default getPosts;
