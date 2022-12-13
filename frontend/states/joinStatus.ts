import { atom, useRecoilState } from "recoil";

// 0: 신청가능단계,  1:모집완료단계 , 2: 내가 참여할때 (참여 불가능) 3:내가 참여할때(참여 가능), 4:인터뷰끝남(피드백), 5. 로그인 안했을때 (신청버튼만 보이게 로그인 유도)
const joinStatus = atom<number>({
  key: "joinState",
  default: -1,
});

const joinStatustState = () => {
  return useRecoilState(joinStatus);
};

export { joinStatus, joinStatustState };
