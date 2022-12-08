export interface Question {
  type: number;
  id: number;
  content: string;
  feedback: string;
}
export interface QuestionProp {
  data: Question;
}

export interface QAItem {
  userId: number;
  userName: string;
  question: Question[];
}

export interface User {
  username: striing;
  userId: number;
}
