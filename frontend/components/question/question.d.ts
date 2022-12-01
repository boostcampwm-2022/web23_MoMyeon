export interface Question {
  type: number;
  id: number;
  contents: string;
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

export interface Username {
  username: striing;
}
