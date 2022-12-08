import apiKeys from "constants/apiKeys";
import axios from "axios";

interface Res {
  questions: Question[];
}
export interface Question {
  userId: number;
  userName: string;
  question: QuestionItem[];
  feedback: string;
}
export interface QuestionItem {
  id: number;
  content: string;
}

async function getManageQuestion(id: string) {
  const res = await axios
    .get<Res>(apiKeys.MANAGE_QUESTION + `/${id}`)
    .then((res) => res.data.questions);
  return res;
}

export default getManageQuestion;
