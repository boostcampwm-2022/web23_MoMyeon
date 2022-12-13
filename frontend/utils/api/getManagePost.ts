import apiKeys from "constants/apiKeys";
import axios from "axios";

export interface Res {
  host: Post[];
  guest: Post[];
}
export interface Post {
  interview_id: number;
  title: string;
  category: Category[];
  status: number;
  applicationDate: string;
}
interface Category {
  id: number;
  name: string;
}

async function getMangePost() {
  const req = await axios.get<Res>(apiKeys.MANAGE_POST).then((res) => res.data);
  return req;
}

export default getMangePost;
