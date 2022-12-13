import { useEffect, useState } from "react";
import { usePostPageUserStatusQuery } from "./usePostPageUserStatusQuery";
interface postInfo {
  isHost: boolean;
  userStatus: number;
  isStart: boolean;
}
const usePostPageStatusCheck = (
  id: string | undefined
): [isHost: boolean, userStatus: number, isStart: boolean] => {
  const [postInfo, setPostInfo] = useState<postInfo>({
    isHost: false,
    userStatus: 0,
    isStart: false,
  });
  const { isHost, userStatus, isStart } = postInfo;

  const { data, error, isError, isSuccess }: any =
    usePostPageUserStatusQuery(id);

  useEffect(() => {
    if (isSuccess && data) {
      const { isHost, userStatus, isStart } = data.data;
      setPostInfo({ ...postInfo, isHost, userStatus, isStart });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      if (error.response.status !== 401) {
        console.log("유저 상태를 불러오는데 실패했습니다.", error);
      }
    }
  }, [isError]);
  return [isHost, userStatus, isStart];
};

export { usePostPageStatusCheck };
