import apiKeys from "constants/apiKeys";
import axios from "axios";
async function getUserInfo() {
  const req = await axios.get(apiKeys.GET_USER_INFO, { withCredentials: true });

  return req;
}

export default getUserInfo;
