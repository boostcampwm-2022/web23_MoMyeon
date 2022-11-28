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
import { Interview } from './interview.entity';
import { InterviewQuestion } from './interviewQuestion.entity';
import { Resume } from './resume.entity';
import { UserInterview } from './userInterview.entity';
import { UserQuestion } from './userQuestion.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  oauth_provider: string;

  @Column({ length: 255 })
  oauth_uid: string;

  @Column({ length: 50, nullable: true })
  nickname: string;

  @Column({ nullable: true })
  profile: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => Resume, (resume) => resume.user)
  resumes: Resume[];

  @OneToMany(() => Interview, (interview) => interview.user)
  interviews: Interview[];

  @OneToMany(() => UserInterview, (userInterview) => userInterview.user)
  userInterview: UserInterview[];

  @OneToMany(
    () => InterviewQuestion,
    (interviewQuestion) => interviewQuestion.user,
  )
  interviewQuestions: InterviewQuestion[];

  @OneToMany(() => UserQuestion, (userQuestion) => userQuestion.user)
  userQuestions: UserQuestion[];
}
