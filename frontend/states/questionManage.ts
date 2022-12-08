import { atom, useSetRecoilState, useRecoilValue } from "recoil";

const questionText = atom({
  key: "questionText",
  default: "",
});

const questionTextSet = () => {
  return useSetRecoilState(questionText);
};

const questionTextValue = () => {
  return useRecoilValue(questionText);
};

export { questionText, questionTextSet, questionTextValue };
