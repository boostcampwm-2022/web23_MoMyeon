import { atom } from "recoil";

export const categoryArray = atom<number[]>({
  key: "categoryArray",
  default: [],
});
