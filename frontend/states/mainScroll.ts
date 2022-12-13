import { atom, useRecoilState } from "recoil";

const mainScroll = atom<number>({
  key: "MainScroll",
  default: -1,
});

const mainScrollState = () => {
  return useRecoilState(mainScroll);
};

export { mainScroll, mainScrollState };
