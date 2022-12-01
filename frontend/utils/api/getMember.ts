import apiKeys from "constants/apiKeys";
import axios from "axios";
async function getMember(id: string) {
  const req = await axios.get(apiKeys.GET_INTERVIEW_MEMBERS + `${id}`);

  return req.data;
}

export default getMember;
