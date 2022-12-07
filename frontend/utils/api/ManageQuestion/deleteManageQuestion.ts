import apiKeys from "constants/apiKeys";
import axios from "axios";

async function deleteManageQuestion(questionId: number) {
  await axios.delete(apiKeys.MANAGE_QUESTION + `/${questionId}`);
}

export default deleteManageQuestion;
