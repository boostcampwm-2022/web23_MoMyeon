import { Dropdown } from "@nextui-org/react";
import { DropDownInfo } from "./header";
import React from "react";
import { ChildComponent } from "types/common";
import styles from "styles/Header.module.scss";

function DropDown({ children }: ChildComponent) {
  const menuItems = [
    { key: "이력서", name: "이력서" },
    { key: "내질문", name: "내질문" },
    { key: "면접관리", name: "면접관리" },
    { key: "로그아웃", name: "로그아웃" },
  ];
  return (
    <Dropdown>
      <Dropdown.Trigger>{children}</Dropdown.Trigger>
      <Dropdown.Menu
        onAction={(key) => {
          console.log(key);
        }}
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
