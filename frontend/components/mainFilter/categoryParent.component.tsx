import React from "react";
import styles from "styles/CategoryFilter.module.scss";
interface CategroyParentProps {
  data: string;
  onClickBtn: Function;
  focused: boolean;
  index: number;
}

function CategoryParent({
  data,
  onClickBtn,
  focused,
  index,
}: CategroyParentProps) {
  return (
    <div
      className={`${styles.parentElement} ${focused && styles.focusBottom}`}
      onClick={() => {
        onClickBtn(index);
      }}
    >
      {data}
    </div>
  );
}

export default React.memo(CategoryParent);
