import { atom, selector } from "recoil";

export const categoryArray = atom<number[]>({
  key: "categoryArray",
  default: [],
});

export const categoryArraySorted = selector({
  key: "categoryArraySorted",
  get: ({ get }) => {
    const temp = get(categoryArray);
    const toSort = [...temp];
    toSort.sort();
    return toSort;
  },
});
