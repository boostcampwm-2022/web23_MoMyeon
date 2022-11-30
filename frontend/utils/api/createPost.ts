import apiKeys from "constants/apiKeys";
import { PostFormTypes } from "components/createPostForm/createPostForm";
import axios from "axios";

async function createPosts(data: PostFormTypes) {
  const category = data.category.map((value) => JSON.parse(value));

  const res = await axios.post(
    apiKeys.CREATE_POSTS,
    {
      title: data.postTitle,
      maxMember: data.peopleLimit,
      category,
      contact: data.contact,
      content: data.detailContents,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return await res.data;
}

export default createPosts;
