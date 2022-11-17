import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Category } from './category.entity';
import { Interview } from './interview.entity';

@Entity()
export class InterviewCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Interview, (interview) => interview.interviewCategories)
  interview: Interview;

  @ManyToOne(() => Category, (category) => category.interviewCategories)
  category: Category;
}
