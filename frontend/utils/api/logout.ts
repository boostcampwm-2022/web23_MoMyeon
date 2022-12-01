import apiKeys from "constants/apiKeys";
import axios from "axios";

async function logoutAxios() {
  console.log(apiKeys.LOGOUT);
  await axios
    .post(apiKeys.LOGOUT, {}, { withCredentials: true })
    .catch((error) => {
      console.log(error);
    });
}

export { logoutAxios };
