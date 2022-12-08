import { Dropdown } from "@nextui-org/react";
import { DropDownInfo } from "./header";
import React, { Key } from "react";
import { ChildComponent } from "types/common";
import { logoutAxios } from "utils/api/logout";
import { useRouter } from "next/router";

function DropDown({ children }: ChildComponent) {
  const router = useRouter();

  const menuItems = [
    { key: "이력서", name: "이력서" },
    { key: "내질문", name: "내질문" },
    { key: "면접관리", name: "면접관리" },
    { key: "로그아웃", name: "로그아웃" },
  ];

  const handleAction = async (key: Key) => {
    if (key === "로그아웃") {
      await onLogoutAction();
    } else if (key === "내질문") {
      onMyQuestionAction();
    } else if (key === "이력서") {
      onClickResume();
    } else if (key === "면접관리") {
      onClickMange();
    }
  };

  const onLogoutAction = async () => {
    await logoutAxios();
    router.reload();
  };

  const onMyQuestionAction = () => {
    router.push("/mypage/question");
  };

  const onClickResume = () => {
    router.push("/mypage/resume");
  };

  const onClickMange = () => {
    router.push("/mypage/manage");
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>{children}</Dropdown.Trigger>
      <Dropdown.Menu
        onAction={(key) => handleAction(key)}
        css={{ height: "13rem" }}
        aria-label="Dynamic Actions"
      >
        {menuItems.map((item: DropDownInfo) => {
          return (
            <Dropdown.Item
              key={item.key}
              color={item.key === "delete" ? "error" : "default"}
              css={{ height: "3rem", fontSize: "1.6rem", padding: "10px" }}
            >
              {item.name}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropDown;
