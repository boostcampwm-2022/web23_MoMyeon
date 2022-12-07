import { apiKeys } from "constants/apiKeys";
import axios from "axios";
import { PostData } from "types/posts";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Cookies from "js-cookie";

const getPostById = async (postId: string, accessToken:string|undefined, refreshToken: string|undefined) => {
  const res = await axios
    .get(`${apiKeys.GET_POST}/${postId}`, {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
    })
    .catch(() => {
      return null;
    });
	
  console.log(res);

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

  dayjs.locale("ko");
  postData.date = dayjs(postData.date).format("YY. MM. DD. HH:mm ");

  return postData;
};

export default getPostById;
