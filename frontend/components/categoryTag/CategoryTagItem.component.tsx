import { useState } from "react";
import { Category } from "types/category";
import styles from "styles/Create.module.scss";
import { UseFormRegister } from "react-hook-form";
import { PostFormTypes } from "components/createPostForm/createPostForm";

export function CategoryTagItem({
  category,
  register,
}: {
  category: Category;
  register: UseFormRegister<PostFormTypes>;
}) {
  const [isChecked, setIsChecked] = useState(false);
  const handleChange = () => {
    setIsChecked((prev: boolean) => !prev);
  };

  return (
    <div>
      <label
        htmlFor={category.id.toString() + category.name}
        className={
          isChecked ? styles.labelCategoryClicked : styles.labelCategory
        }
      >
        {category.name}
      </label>
      <input
        onClick={handleChange}
        id={category.id.toString() + category.name}
        className={styles.inputCheckbox}
        key={category.id}
        {...register("category")}
        type="checkbox"
        value={category.name}
      />
    </div>
  );
}
