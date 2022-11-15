import apiKeys from "constants/apiKeys";
async function getPosts() {
  const req = await fetch(apiKeys.GET_POSTS);
  const data = await req.json();
  return data;
}

export default getPosts;
