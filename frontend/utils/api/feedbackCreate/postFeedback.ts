import apiKeys from "constants/apiKeys";
import axios from "axios";

async function postFeedback({ roomId }: { roomId: string }) {
  await axios.post(apiKeys.CREATE_FEEDBACK + `/${roomId}`);
}

export default postFeedback;
