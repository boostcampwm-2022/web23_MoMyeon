import { StaticImageData } from "next/image";
import {Cookie} from "types/auth";

export interface Object {
  auth: string;
}
export interface Props {
  cookie: Cookie ;
}

export interface ImageInfo {
  style: string;
  src: StaticImageData;
  w: number;
  h: number;
  alt: string;
}

export interface DropDownInfo {
  key: string;
  name: string;
}
