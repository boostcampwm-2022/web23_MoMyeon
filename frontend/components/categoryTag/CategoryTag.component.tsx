import { useState, useEffect } from "react";
import apiKeys from "constants/apiKeys";
import {Category} from "types/category";
import {CategoryTagItem} from "./CategoryTagItem.component";

export function CategoryTag(
  {register} : any){
  const [categories, setCategories] = useState([]);

  useEffect(()=> {
    const controller = new AbortController();
    fetch(apiKeys.GET_CATEGORIES)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });
    return () => {
      controller.abort();
    }
  },[]);


  return (
    <div>
      {categories?.map((category : Category)=>{
        return <CategoryTagItem category ={category} register = {register}/>
      })}
    </div>
  );
}