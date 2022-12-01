import { atom, useSetRecoilState, useRecoilState } from "recoil";

const loginModal = atom({
  key: "loginModalState",
  default: false,
});

const loginModalSet = () => {
  return useSetRecoilState(loginModal);
};

const loginModatState = () => {
  return useRecoilState(loginModal);
};

export { loginModal, loginModalSet, loginModatState };
