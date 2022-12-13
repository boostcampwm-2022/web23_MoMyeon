import apiKeys from "constants/apiKeys";
import axios from "axios";

interface Res {
  resume: Resume[];
}
interface Resume {
  item: string;
  itemId: number;
  content: ResumeItem[];
}
interface ResumeItem {
  id: number;
  text: string;
}
async function getMyResume() {
  const res = await axios
    .get<Res>(apiKeys.MY_RESUME)
    .then((res) => res.data.resume);
  return res;
}

export default getMyResume;
