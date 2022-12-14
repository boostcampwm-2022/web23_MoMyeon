import React, { useEffect, useState, useCallback } from "react";
import styles from "styles/CategoryFilter.module.scss";
import {
  CategoryProps,
  Category,
  CategoryTable,
  CategoryParentProps,
} from "types/category";
import CategoryParent from "./categoryParent.component";
import CategoryElement from "./category.component";
import { categoryArrayState } from "states/categoryArray";
import { categoryParentState } from "states/categoryParent";

function CategoryContainer({
  category,
  categoryKey,
}: CategoryProps & CategoryParentProps) {
  const [categoryArr, setCategoryArr] = categoryArrayState();
  const [current, setCurrent] = categoryParentState();
  const onClickParent = useCallback(
    (idx: number) => {
      setCurrent(idx);
    },
    [setCurrent]
  );

  const onClickChild = (idx: number) => {
    if (categoryArr.includes(idx)) {
      setCategoryArr((prev) => prev.filter((item) => item !== idx));
      return;
    }
    setCategoryArr([...categoryArr, idx]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.parent}>
        {categoryKey.map((item: string, index: number) => {
          const focused = index === current;
          return (
            <CategoryParent
              focused={focused}
              index={index}
              key={item}
              data={item}
              onClickBtn={onClickParent}
            />
          );
        })}
      </div>
      <div className={styles.child}>
        {category &&
          category[categoryKey[current]]?.map((item: Category) => {
            const { id, name } = item;
            const focused = categoryArr.includes(id);
            return (
              <CategoryElement
                onClickBtn={() => onClickChild(id)}
                key={id}
                focused={focused}
                name={name}
              />
            );
          })}
      </div>
    </div>
  );
}

export default CategoryContainer;
