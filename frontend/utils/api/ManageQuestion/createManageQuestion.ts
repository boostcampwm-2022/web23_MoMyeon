import apiKeys from "constants/apiKeys";
import axios from "axios";

interface Req {
  content: string;
  interview_id: number;
  interviewee_id: number;
}

async function createManageQuestion({
  content,
  userId,
  roomId,
}: {
  content: string;
  userId: number;
  roomId: number;
}) {
  await axios.post<Req>(apiKeys.MANAGE_QUESTION, {
    content,
    interviewee_id: userId,
    interview_id: roomId,
  });
}

export default createManageQuestion;
