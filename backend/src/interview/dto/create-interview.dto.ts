type Category = {
  id: number;
  name: string;
};

export class CreateInterviewDto {
  title: string;

  maxMember: number;
  max_member: number;

  contact: string;

  content: string;

  category: Array<Category>;
}
