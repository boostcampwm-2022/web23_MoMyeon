import apiKeys from "constants/apiKeys";
import axios from "axios";
async function getPostPageUserStatus(id: string) {
  const rst = await axios.get(apiKeys.GET_POSTPAGE_USER_STATUS + `${id}`);
  return rst;
}

export { getPostPageUserStatus };
