import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilState,
} from "recoil";

const feedbackStarted = atom<boolean>({
  key: "feedbackStarted",
  default: false,
});

const feedbackStartedSet = () => {
  return useSetRecoilState(feedbackStarted);
};
const feedbackStartedValue = () => {
  return useRecoilValue(feedbackStarted);
};

const feedbackStartedState = () => {
  return useRecoilState(feedbackStarted);
};

export { feedbackStartedSet, feedbackStartedValue, feedbackStartedState };
