import apiKeys from "constants/apiKeys";
import axios from "axios";

interface Req {
  content: string;
}
interface Res {
  question_id: number;
}
async function createMyQuestion({ content }: { content: string }) {
  await axios.post<Req, Res>(apiKeys.MY_QUESTION, { content });
}

export default createMyQuestion;
