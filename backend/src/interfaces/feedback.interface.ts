import { QuestionType } from 'src/enum/questionType.enum';

export interface FeedbackInfo {
  nickname: string;
  type: QuestionType;
  id: number;
  contents: string;
  feedback: string;
  isScrapped: boolean;
}
