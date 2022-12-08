import apiKeys from "constants/apiKeys";
import axios from "axios";
async function getPostPageUserstatus(id: string) {
  return await axios.get(apiKeys.GET_POSTPAGE_USER_STATUS + `${id}`);
}

export { getPostPageUserstatus };
