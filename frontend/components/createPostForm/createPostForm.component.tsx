import styles from "styles/Create.module.css";
import React from "react";
import {FieldErrors, useForm} from 'react-hook-form' ;
import {postFormTypes} from "./createPostForm";


const CreatePostForm = () => {

  const disableTab = (e : React.KeyboardEvent<HTMLElement>) => {
    if(e.code === 'Tab'){
      e.preventDefault();
    }
  }

  const onValid = (data : postFormTypes) => {
    alert(data.contact);
    console.log(data);
    console.log('onValid');
    reset();
  }

  const onError = (message: FieldErrors) => {
    let log : string = "";
    log += errors.postTitle?.message
    alert(log);
  }

  const { register, handleSubmit, reset, formState: {errors} } = useForm<postFormTypes>();


  return (
    <form className={styles.createForm} onSubmit={handleSubmit(onValid, onError)} method="post">
      <label htmlFor='postTitle'> 제목 </label>
      <input
        {...register('postTitle',{maxLength:{value:10, message:'제목은 10글자까지만 가능해용'}}) }
        type='text'
        id='postTitle'
        name='postTitle'
        placeholder='모의 면접 제목'
      />
      <label htmlFor='peopleLimit'> 최대 인원 </label>
      <select {...register('peopleLimit')} id='peopleLimit'>
        <option value='2'> 2명 </option>
        <option value='3'> 3명 </option>
        <option value='4'> 4명 </option>
        <option value='5'> 5명 </option>
        <option value='6'> 6명 </option>
      </select>
      <label htmlFor='category'> 면접 카테고리 </label>

      <label htmlFor='contact'> 연락 방법 </label>
      <input
        {...register('contact')}
        type='text'
        id='contact'
        name='contact'
        placeholder='링크를 적어주세요 ! '
      />
      <label htmlFor='detailContents'> 모의 면접에 대한 상세 내용을 적어주세요 </label>
      <textarea
        {...register('detailContents')}
        id='detailContents'
        name='detailContents'
        placeholder='모의 면접 선호 시간, 경력 여부 등 모의 면접에 필요한 정보를 알려 주세요 '
        onKeyDown={(e) => disableTab(e)}
      />
      <button type='submit'> 모집하기 </button>
    </form>
  );
}

export default CreatePostForm ;