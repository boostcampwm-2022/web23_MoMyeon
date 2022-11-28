import { atom } from "recoil";
import { UserData } from "types/auth";

export const userDataRecoil = atom<UserData>({
  key: "userData",
  default: { profile: null, nickname: null },
});