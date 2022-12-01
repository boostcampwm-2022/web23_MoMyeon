import React, { useEffect, useState, useCallback } from "react";
import styles from "styles/CategoryFilter.module.scss";
import { CategoryProps, Category, CategoryTable } from "types/category";
import CategoryParent from "./categoryParent.component";
import CategoryElement from "./category.component";
import { categoryArray } from "states/categoryArray";
import { categoryParent } from "states/categoryParent";
import { useRecoilState } from "recoil";
function CategoryContainer({ category }: CategoryProps) {
  const [categoryArr, setCategoryArr] = useRecoilState(categoryArray);
  const [table, setTable] = useState<CategoryTable>({});
  const [key, setKey] = useState<string[]>([]);
  const [current, setCurrent] = useRecoilState(categoryParent);
  const keyTemp: string[] = [];
  const tableTemp: any = {};

  useEffect(() => {
    if (keyTemp.length < 1) {
      category.forEach((item: Category) => {
        const { id, name, subjecj } = item;
        if (tableTemp[subjecj]) {
          tableTemp[subjecj] = [...tableTemp[subjecj], { id, name, subjecj }];
          return;
        }
        tableTemp[subjecj] = [{ id, name, subjecj }];
        keyTemp.push(subjecj);
      });
      setTable(tableTemp);
      setKey(keyTemp);
    }
  }, []);

  const onClickParent = useCallback((idx: number) => {
    setCurrent(idx);
  }, []);

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
        {key.map((item: string, index: number) => {
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
        {key.length > 0 &&
          table[key[current]].map((item: Category) => {
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
