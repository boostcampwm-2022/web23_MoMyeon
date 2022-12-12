import { QuestionType } from 'src/enum/questionType.enum';

export interface InterviewQuestionData {
  content: string;
  interviewId: number;
  userId: number;
  user_to: number;
  user_toName: string;
}

export interface QuestionFeedback {
  type: QuestionType;
  id: number;
  content: string;
  feedback: string;
}

export interface QuestionResult {
  userId: number;
  userName: string;
  question: QuestionFeedback[];
}
