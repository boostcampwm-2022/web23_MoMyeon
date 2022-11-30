import { Category } from "types/category";
import { CategoryTagItem } from "./CategoryTagItem.component";
import styles from "styles/Create.module.scss";
import { useCategoryQuery } from "utils/hooks/useCategoryQuery";
import { UseFormRegister } from "react-hook-form";
import { PostFormTypes } from "components/createPostForm/createPostForm";

export function CategoryTag({
  register,
}: {
  register: UseFormRegister<PostFormTypes>;
}) {
  const categories = useCategoryQuery();

  return (
    <div className={styles.categoryContainer}>
      {categories?.map((category: Category) => {
        return (
          <CategoryTagItem
            key={category.id}
            category={category}
            register={register}
          />
        );
      })}
    </div>
  );
}
