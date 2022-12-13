import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilState,
} from "recoil";

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

const interviewUserState = () => {
  return useRecoilState(interviewUser);
};

export {
  interviewUser,
  interviewUserSet,
  interviewUserValue,
  interviewUserState,
};
