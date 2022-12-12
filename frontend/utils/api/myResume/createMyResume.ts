import apiKeys from "constants/apiKeys";
import axios from "axios";

interface Req {
  content: string;
  item: string;
}
interface Res {
  content: string;
  user: number;
  item: string;
  deleted_at: null;
  id: number;
  created_at: Date | string;
  updated_at: Date | string;
}
async function createMyResume({ content, item }: Req) {
  await axios.post<Req, Res>(apiKeys.MY_RESUME, { content, item });
}

export default createMyResume;
