import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { QuestionType } from '../enum/questionType.enum';
import { Interview } from './interview.entity';

@Entity()
export class Feedback extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question_type: QuestionType;

  @Column()
  question_id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  questionContent: string;

  @Column()
  interviewId: number;

  @Column()
  user_from: number;

  @Column()
  user_to: number;

  @Column()
  user_fromName: string;

  @Column()
  user_toName: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Interview, (interview) => interview.feedbacks)
  interview: Interview;
}
