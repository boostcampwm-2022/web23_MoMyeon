import { atom, useRecoilState } from "recoil";

const categoryParent = atom<number>({
  key: "categoryParent",
  default: 0,
});

const categoryParentState = () => {
  return useRecoilState(categoryParent);
};

export { categoryParent, categoryParentState };
