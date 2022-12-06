import {
  atom,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
} from "recoil";

interface Resume {
  id: null | number;
  item: null | string;
}
const resume = atom<Resume>({
  key: "resumeState",
  default: { id: null, item: null },
});

const resumeSet = () => {
  return useSetRecoilState(resume);
};

const resumeState = () => {
  return useRecoilState(resume);
};

const resumeValue = () => {
  return useRecoilValue(resume);
};

export { resume, resumeSet, resumeState, resumeValue };
