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
import { User } from './user.entity';
import { UserInterviewStatus } from '../enum/userInterviewStatus.enum';
import { Interview } from './interview.entity';

@Entity()
export class UserInterview extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: UserInterviewStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.userInterview)
  user: User;

  @ManyToOne(() => Interview, (interview) => interview.userInterviews)
  interview: Interview;
}
