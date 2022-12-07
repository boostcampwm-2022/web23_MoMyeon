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
import { Interview } from './interview.entity';
import { User } from './user.entity';

@Entity()
export class InterviewQuestion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column()
  user_to: number;

  @Column()
  user_toName: string;

  @ManyToOne(() => Interview, (interview) => interview.interviewQuestions)
  interview: Interview;

  @ManyToOne(() => User, (user) => user.interviewQuestions)
  user: User;
}
