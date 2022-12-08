import apiKeys from "constants/apiKeys";
import axios from "axios";

interface Req {
  userId: number;
  nickname: string;
  type: number;
  questionId: number;
  feedback: string;
}

interface RoomId {
  roomId: string;
}

async function patchFeedback({
  userId,
  nickname,
  type,
  questionId,
  feedback,
  roomId,
}: Req & RoomId) {
  await axios.patch<Req>(apiKeys.CREATE_FEEDBACK + `/${roomId}`, {
    userId,
    nickname,
    type,
    questionId,
    feedback,
  });
}

export default patchFeedback;
