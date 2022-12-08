import apiKeys from "constants/apiKeys";
import axios from "axios";

async function applyInterview(id: string) {
  const rst = await axios.post(apiKeys.APPLY_INTERVIEW + `${id}`);
  console.log(rst);
}

export { applyInterview };
