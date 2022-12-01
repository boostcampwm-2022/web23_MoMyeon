export interface Question {
  type: number;
  id: number;
  contents: string;
  feedback: string;
}
export interface QuestionProp {
  data: Question;
}
