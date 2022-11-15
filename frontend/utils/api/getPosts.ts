import apiKeys from "constants/apiKeys";

async function getPosts() {
  const req = await fetch(apiKeys.GET_POSTS);
  return await req.json();
}

export default getPosts;
