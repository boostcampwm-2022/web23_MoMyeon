export interface FeedbackData {
  userId: number;
  userName: string;
  question: FeedbackQuestionData[];
}

export interface FeedbackQuestionData {
  contents: string;
  feedback: string;
  id: number;
  isScrapped: boolean;
  nickname: string;
  type: number;
}
