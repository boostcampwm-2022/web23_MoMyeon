import styles from "styles/Create.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FieldErrors, useForm } from "react-hook-form";
import { PostFormTypes } from "./createPostForm";
import createPost from "utils/api/createPost";
import { CategoryTag } from "components/categoryTag/CategoryTag.component";

const CreatePostForm = () => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    return () => setSubmitted(false);
  });

  const disableTab = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.code === "Tab") {
      e.preventDefault();
    }
  };

  const onValid = async (data: PostFormTypes) => {
    if (submitted) {
      return;
    }
    setSubmitted(true);

    if (!data.category) {
      data.category = [];
    }

    const res = await createPost(data);
    if (res !== null) {
      reset();
      //replace created page//
      await router.replace("/");
    }
  };

  const onError = (errors: FieldErrors) => {
    let log: string = "";
    log += `${errors.postTitle?.message}\n\n`;

    if (errors.peopleLimit?.message) {
      log += `${errors.peopleLimit?.message}\n\n`;
    }
    alert(log);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormTypes>();

  return (
    <form
      className={styles.createForm}
      onSubmit={handleSubmit(onValid, onError)}
      method="post"
    >
      <label className={styles.labelTitle} htmlFor="postTitle">
        제목
      </label>
      <input
        className={styles.inputText}
        {...register("postTitle", {
          maxLength: { value: 256, message: "제목은 256글자까지만 가능해요" },
          minLength: { value: 3, message: "제목은 3글자 이상 써주세요" },
          required: "제목을 적어주세요",
        })}
        type="text"
        id="postTitle"
        name="postTitle"
        placeholder="모의 면접 제목"
      />
      <label className={styles.labelTitle} htmlFor="peopleLimit">
        최대 인원
      </label>
      <select
        {...register("peopleLimit", {
          required: "최대 인원을 입력해주세요",
          max: { value: 6, message: "최대 인원은 6명이에요" },
          min: { value: 2, message: "2명은 필요해요 ! " },
        })}
        id="peopleLimit"
      >
        <option value="2"> 2명 </option>
        <option value="3"> 3명 </option>
        <option value="4"> 4명 </option>
        <option value="5"> 5명 </option>
        <option value="6"> 6명 </option>
      </select>
      <label className={styles.labelTitle}>면접 카테고리</label>
      <CategoryTag register={register} />
      <label className={styles.labelTitle} htmlFor="contact">
        연락 방법
      </label>
      <input
        className={styles.inputText}
        {...register("contact")}
        type="text"
        id="contact"
        name="contact"
        placeholder="링크를 적어주세요 ! "
      />
      <label className={styles.labelTitle} htmlFor="detailContents">
        모의 면접에 대한 상세 내용을 적어주세요
      </label>
      <textarea
        {...register("detailContents")}
        id="detailContents"
        name="detailContents"
        placeholder="모의 면접 선호 시간, 경력 여부 등 모의 면접에 필요한 정보를 알려 주세요 "
        onKeyDown={(e) => disableTab(e)}
      />
      <button className={styles.createFormButtonSubmit} type="submit">
        모집하기
      </button>
    </form>
  );
};

export default CreatePostForm;
