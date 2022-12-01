import ApiKeys, { apiKeys } from "constants/apiKeys";
import axios from "axios";
import { PostData } from "types/posts";

const getPostById = async (postId: string) => {
  const res = await axios.get(`${apiKeys.GET_POST}/${postId}`).catch(() => {
    return null;
  });

  const data = res?.data.interviewData;
  if (!data) {
    return null;
  }

  const postData: PostData = {
    title: data.title ?? "반갑습니다. 모면입니다. !",
    category: data.category ?? [],
    contact: data.contact ?? "연락 방법이 없습니다.",
    content: data.content.split("\n") ?? ["추가 내용이 없습니다."],
    count: data.count ?? 0,
    date: data.date ?? "",
    host: data.host ?? "blindcat",
    isHost: data.isHost ?? false,
    maxMember: data.maxMember ?? 6,
    member: data.maxMember ?? 1,
    postId: data.interview_id ?? Number(postId),
    recruitStatus: data.recruitStatus ?? 0,
    userStatus: data.userStatus ?? 0,
  };

  if (postData.date.length > 16) {
    postData.date = `${data.date.substring(0, 10)}`;
    postData.date += ` / ${data.date.substring(11, 16)}`;
  }


  return postData;
};

export default getPostById;
