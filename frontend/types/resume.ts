export interface ResumeItem {
  title: string;
  content: string;
}
export interface ResumeT {
  userId: number;
  nickname: string;
  resume: ResumeItem[];
}

export interface ResumeProp {
  resume: ResumeT;
}
