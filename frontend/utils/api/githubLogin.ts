import apiKeys from "constants/apiKeys";
import axios from "axios";
async function githubLogin(code: string | null) {
  const req = await axios.post(
    apiKeys.GITHUB_LOGIN_AUTH_REQUEST,
    { code },
    { withCredentials: true }
  );

  return req;
}

export default githubLogin;
