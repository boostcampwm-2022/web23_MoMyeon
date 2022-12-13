import apiKeys from "constants/apiKeys";
import axios from "axios";

async function getFeedback(id: string) {
  return await axios.get(apiKeys.GET_FEEDBACKS + id);
}

export { getFeedback };
