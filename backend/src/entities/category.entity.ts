import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { InterviewCategory } from './interviewCategory.entity';
import { SimpleQuestion } from './simpleQuestion.entity';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sub_category: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(
    () => InterviewCategory,
    (interviewCategory) => interviewCategory.category,
  )
  interviewCategories: InterviewCategory[];

  @OneToMany(() => SimpleQuestion, (simpleQuestion) => simpleQuestion.category)
  simpleQuestions: SimpleQuestion[];
}
