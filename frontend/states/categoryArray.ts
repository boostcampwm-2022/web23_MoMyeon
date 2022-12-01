import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

const categoryArray = atom<number[]>({
  key: "categoryArray",
  default: [],
});

const categoryArrayState = () => {
  return useRecoilState(categoryArray);
};

const categoryArraySorted = selector({
  key: "categoryArraySorted",
  get: ({ get }) => {
    const temp = get(categoryArray);
    const toSort = [...temp];
    toSort.sort();
    return toSort;
  },
});

const categoryArraySortedValue = () => {
  return useRecoilValue(categoryArraySorted);
};
export { categoryArray, categoryArrayState, categoryArraySortedValue };
