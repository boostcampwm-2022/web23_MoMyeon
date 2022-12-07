export interface ResumeContainerProps {
  itemId: number;
  item: string;
  content: ResumeItem[];
}

export interface ResumeItem {
  id: number;
  text: string;
}

export interface ResumeItemProps {
  data: ResumeItem;
}
