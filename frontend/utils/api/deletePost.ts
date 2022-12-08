import apiKeys from "constants/apiKeys";
import axios from "axios";

async function deletePost(id: string) {
  await axios.delete(apiKeys.DELETE_POST + `/${id}`);
  //console.log(rst);
}

export { deletePost };
