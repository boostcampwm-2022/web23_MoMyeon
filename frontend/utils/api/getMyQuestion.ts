import apiKeys from "constants/apiKeys";
import axios from "axios";

interface Question {
  id: number;
  contents: string;
}
async function getMyQuestion() {
  const res = await axios
    .get<Question[]>(apiKeys.MY_QUESTION)
    .then((res) => res.data);
  return res;
}

export default getMyQuestion;
