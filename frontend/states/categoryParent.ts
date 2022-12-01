import { atom } from "recoil";

export const categoryParent = atom<number>({
  key: "categoryParent",
  default: 0,
});
