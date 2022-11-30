import React, { useCallback } from "react";
import styles from "styles/CategoryFilter.module.scss";

interface CategoryProps {
  name: string;
  focused: boolean;
  onClickBtn: Function;
}
function CategoryElement({ name, focused, onClickBtn }: CategoryProps) {
  return (
    <div
      onClick={() => onClickBtn()}
      className={`${styles.category} ${focused && styles.focusCategory}`}
    >
      {name}
    </div>
  );
}

export default React.memo(CategoryElement);
