export interface SaveFeedbackDto {
  userId: number;
  nickname: string;
  type: number;
  questionId: number;
  feedback: string;
}
