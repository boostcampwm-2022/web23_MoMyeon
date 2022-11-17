import { PartialType } from '@nestjs/mapped-types';
import { CreateInterviewDto } from './create-interview.dto';

type Category = {
  id: number;
  name: string;
};

export class UpdateInterviewDto extends PartialType(CreateInterviewDto) {
  title: string;

  maxMember: number;
  max_member: number;

  contact: string;

  content: string;

  category: Array<Category>;
}
