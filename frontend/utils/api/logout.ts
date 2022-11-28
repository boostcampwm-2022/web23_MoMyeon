import apiKeys from "constants/apiKeys";
import axios from "axios";

async function logoutAxios() {
  const response = await axios(apiKeys.LOGOUT);
  return await response.data;
}

export { logoutAxios };
