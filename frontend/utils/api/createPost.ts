import apiKeys from "constants/apiKeys";
import { Post } from "../../types/posts";

async function getPosts(data : Post) {

  const response = await fetch(apiKeys.CREATE_POSTS, {
    method: "POST",
    body: JSON.stringify({ data: data }),
    headers: {
      'Content-type' : 'application/json'
    }
  });

  return await response.json();
}

export default getPosts;
