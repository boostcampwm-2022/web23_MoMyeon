import apiKeys from "constants/apiKeys";
async function getPosts({ pageParam = 0 }) {
  const req = await fetch(apiKeys.GET_POSTS + `/${pageParam}`, {
    mode: "cors",
  });
  const data = await req.json();
  return data;
}

export default getPosts;
