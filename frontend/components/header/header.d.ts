import { StaticImageData } from "next/image";

export interface Object {
  auth: string;
}
export interface Props {
  cookie: string | undefined ;
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
