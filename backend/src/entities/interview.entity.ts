import { InterviewStatus } from 'src/enum/userInterviewStatus.enum';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Feedback } from './feedback.entity';
import { InterviewCategory } from './interviewCategory.entity';
import { InterviewQuestion } from './interviewQuestion.entity';
import { User } from './user.entity';
import { UserInterview } from './userInterview.entity';

@Entity()
export class Interview extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  max_member: number;

  @Column({ default: 0 })
  current_member: number;

  @Column()
  contact: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  categoryList: string;

  @Column({ default: 0 })
  count: number;

  @Column({ default: InterviewStatus.RECRUITING })
  status: InterviewStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.interviews)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  userId: number;

  @OneToMany(() => UserInterview, (userInterview) => userInterview.interview)
  userInterviews: UserInterview[];

  @OneToMany(
    () => InterviewCategory,
    (InterviewCategory) => InterviewCategory.interview,
  )
  interviewCategories: UserInterview[];

  @OneToMany(
    () => InterviewQuestion,
    (interviewQuestion) => interviewQuestion.interview,
  )
  interviewQuestions: InterviewQuestion[];

  @OneToMany(() => Feedback, (feedback) => feedback.interview)
  feedbacks: Feedback[];
}
