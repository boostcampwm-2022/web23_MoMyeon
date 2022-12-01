import { atom, useSetRecoilState, useRecoilValue } from "recoil";

const interviewUser = atom<number>({
  key: "interviewUser",
  default: -1,
});

const interviewUserSet = () => {
  return useSetRecoilState(interviewUser);
};
const interviewUserValue = () => {
  return useRecoilValue(interviewUser);
};

export { interviewUser, interviewUserSet, interviewUserValue };
