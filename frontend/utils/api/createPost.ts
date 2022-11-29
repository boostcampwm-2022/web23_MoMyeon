import apiKeys from "constants/apiKeys";
export interface Post {
  title: string;
  hashtag: string[];
  user: string;
  view: number;
}
async function getPosts(data: Post) {
  const response = await fetch(apiKeys.CREATE_POSTS, {
    method: "POST",
    body: JSON.stringify({ data: data }),
    headers: {
      "Content-type": "application/json",
    },
  });

  return await response.json();
}

export default getPosts;
