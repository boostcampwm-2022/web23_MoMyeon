import { useEffect } from "react";
import { usePostPageStatusCheck } from "utils/hooks/usePostPageStatus/usePostPageStatusCheck";
import { joinStatustState } from "states/joinStatus";
import { usePostPageUserStatusQuery } from "./usePostPageStatus/usePostPageUserStatusQuery";
export default function useJoinHandle({
  postId,
}: {
  postId: string | undefined;
}) {
  if (!postId) {
    throw Error("postId 없음");
  }
  const { data, isLoading, isError } = usePostPageUserStatusQuery(postId);
  const [, setJoinStatus] = joinStatustState();
  if (isError) {
    throw new Error("error");
  }
  // 0: 신청가능단계,  1:모집완료단계 , 2: 내가 참여할때 (참여 불가능) 3:내가 참여할때(참여 가능), 4:인터뷰끝남(피드백)
  useEffect(() => {
    // 호스트 X
    if (data) {
      const { isHost, isStart, userStatus, interviewStatus } = data.data;
      if (interviewStatus === 2) {
        setJoinStatus(4);
        return;
      }
      if (isHost) {
        setJoinStatus(3);
        return;
      }
      // 신청 끝, 내가 신청못함
      if (interviewStatus === 1 && userStatus === 0) {
        setJoinStatus(1);
        return;
      }
      // 신청 가능, 내가 신청아직 안함
      if (interviewStatus === 0 && userStatus === 0) {
        setJoinStatus(1);
        return;
      }

      // 신청 O, 면접시작 X
      if (userStatus === 2 && isStart === false) {
        setJoinStatus(2);
        return;
      }
      // 신청 O, 면접시작 O
      if (userStatus === 2 && isStart === true) {
        setJoinStatus(3);
        return;
      }
    }
  }, [data]);
}
