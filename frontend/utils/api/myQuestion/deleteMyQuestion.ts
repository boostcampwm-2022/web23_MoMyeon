import apiKeys from "constants/apiKeys";
import axios from "axios";

async function deleteMyQuestion(questionId: number) {
  await axios.delete(apiKeys.MY_QUESTION + `/${questionId}`);
}

export default deleteMyQuestion;
