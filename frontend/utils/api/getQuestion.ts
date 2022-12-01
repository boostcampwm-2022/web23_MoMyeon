import apiKeys from "constants/apiKeys";
import axios from "axios";
async function getQuestion(id: string) {
  const req = await axios.get(apiKeys.GET_INTERVIEW_QUESTIONS + `${id}`);

  return req.data;
}

export default getQuestion;
