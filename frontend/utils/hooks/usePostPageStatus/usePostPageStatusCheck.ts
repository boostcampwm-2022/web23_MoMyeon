import { useEffect, useState } from "react";
import { usePostPageUserStatusQuery } from "./usePostPageUserStatusQuery";

const usePostPageStatusCheck = (
  id: string | undefined
): [isHost: boolean, userStatus: number] => {
  const [isHost, setIsHost] = useState<boolean>(false);
  const [userStatus, setUserStatus] = useState<number>(0);
  const { data, error, isError, isSuccess }: any =
    usePostPageUserStatusQuery(id);

  useEffect(() => {
    if (isSuccess) {
      setIsHost(data?.data.isHost);
      setUserStatus(data?.data.userStatus);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      if (error.response.status !== 401) {
        console.log("유저 상태를 불러오는데 실패했습니다.", error);
      }
    }
  }, [isError]);

  return [isHost, userStatus];
};

export { usePostPageStatusCheck };
