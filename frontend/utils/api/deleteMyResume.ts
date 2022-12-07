import apiKeys from "constants/apiKeys";
import axios from "axios";

async function deleteMyResume(resumeId: number) {
  await axios.delete(apiKeys.MY_RESUME + `/${resumeId}`);
}

export default deleteMyResume;
