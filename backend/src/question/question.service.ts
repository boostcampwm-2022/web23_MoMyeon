import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SimpleQuestion } from 'src/entities/simpleQuestion.entity';
import { Feedback } from 'src/entities/feedback.entity';
import { Interview } from 'src/entities/interview.entity';
import { UserInterview } from 'src/entities/userInterview.entity';
import { InterviewCategory } from 'src/entities/interviewCategory.entity';
import { Category } from 'src/entities/category.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UserInterviewStatus } from 'src/enum/userInterviewStatus.enum';
import { User } from 'src/entities/user.entity';
import { QuestionType } from 'src/enum/questionType.enum';
import { CreateUserQuestionDto } from './dto/create-user-question.dto';
import { UserQuestion } from 'src/entities/userQuestion.entity';
import { InterviewQuestionData } from 'src/interfaces/question.interface';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(SimpleQuestion)
    private simpleQuestionRepository: Repository<SimpleQuestion>,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    @InjectRepository(UserInterview)
    private userInterviewRepository: Repository<UserInterview>,
    @InjectRepository(InterviewCategory)
    private interviewCategoryRepository: Repository<InterviewCategory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createQuestionDto: CreateQuestionDto) {
    return 'This action adds a new question';
  }

  findAll() {
    return this.simpleQuestionRepository.createQueryBuilder().getRawMany();
    return `This action returns all question`;
  }

  /**
   * 3단계 적용 전 임시 사용
   * @param id interview 정보
   * @returns 분야 참여자
   */
  async findTemporaryRoomQuestion(id: number) {
    // userId로 캐싱한 값이 있는지 확인(로직 추가 필요)

    // 0. id -> interview(방정보 가져오기)
    const interviewData = await this.interviewRepository
      .createQueryBuilder()
      .where({ id })
      .getRawOne();
    //category 정보
    const categoryData = await this.interviewCategoryRepository
      .createQueryBuilder('ic')
      .leftJoinAndSelect(Category, 'category', 'ic.categoryId = category.id')
      .select(['category.id AS id', 'category.name AS name'])
      .where('ic.interviewId = :id', { id: id })
      .getRawMany();

    // 1. id -> user_interview(참여 유저)
    const userInterviewData = await this.userInterviewRepository
      .createQueryBuilder('ui')
      .leftJoinAndSelect(User, 'user', 'ui.userId = user.id')
      .select(['ui.userId AS userId', 'user.nickname AS userName'])
      .where('interviewId = :id AND status = :status', {
        id: id,
        status: UserInterviewStatus.ACCEPTED,
      })
      .getRawMany();

    // 2. 면접 분야 심플해당 파트에서 랜덤으로 가져오기
    const where = { sql: `categoryId = 14 `, value: {} };
    categoryData.forEach((element) => {
      where.sql += `OR categoryId = ${element.id} `;
    });
    const simpleQuestionData = await this.simpleQuestionRepository
      .createQueryBuilder()
      .select(['id', 'content AS contents'])
      .where(where.sql)
      .getRawMany();
    //3. 출력가공
    let questions;
    if (userInterviewData.length) {
      questions = userInterviewData;
    } else {
      questions = [
        { userId: '1', userName: 'userA' },
        { userId: '2', userName: 'userB' },
        { userId: '3', userName: 'userC' },
        { userId: '4', userName: 'userD' },
        { userId: '5', userName: 'userE' },
        { userId: '6', userName: 'userF' },
      ].slice(0, interviewData['Interview_max_member']);
    }
    const userSimpleQuestionData = simpleQuestionData.map((object) => {
      object['type'] = QuestionType.SIMPLE;
      object['feedback'] = '';
      return object;
    });
    questions.forEach((element) => {
      const questionsCount = 5;
      const begin = Math.floor(
        Math.random() * (userSimpleQuestionData.length - questionsCount),
      );
      const questionData = userSimpleQuestionData.slice(
        begin,
        begin + questionsCount,
      );
      element['question'] = questionData;
    });
    return questions;
  }
  findRoomQuestion(id: number) {
    // 0. id -> interview(방정보 가져오기)
    // 1. id -> user_interview(참여 유저) -> interview_question(참여유저 별 세팅질문)
    // 2. 세팅질문이 없다면, simple_question(심플질문) 면접 분야 질문 추가, 부족하면 기타 질문에서 추가
    // 3. 면접 분야 심플해당 파트에서 랜덤으로 가져오기
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}

@Injectable()
export class UserQuestionService {
  constructor(
    @InjectRepository(UserQuestion)
    private UserQuestionRepository: Repository<UserQuestion>,
  ) {}

  async create(createUserQuestionDto: CreateUserQuestionDto) {
    try {
      const userQuestion = await this.UserQuestionRepository.find({
        where: createUserQuestionDto,
      });
      if (userQuestion.length)
        throw new BadRequestException('이미 등록된 질문입니다.');
      const newUserQuestion = this.UserQuestionRepository.create(
        createUserQuestionDto,
      );
      const saveUserQuestion = await this.UserQuestionRepository.save(
        newUserQuestion,
      );
      return { id: saveUserQuestion.id };
    } catch (err) {
      throw err;
    }
  }

  findAll(userId: number) {
    const userQuestion = this.UserQuestionRepository.createQueryBuilder()
      .select(['id', 'content AS contents'])
      .where('userId = :userId', { userId: userId })
      .getRawMany();
    return userQuestion;
  }

  async remove(id: number, userId: number) {
    try {
      const userQueryDeleteData =
        await this.UserQuestionRepository.createQueryBuilder('')
          .softDelete()
          .where('id = :id AND userId = :userId', { id: id, userId: userId })
          .execute();
      if (!userQueryDeleteData.affected)
        throw new BadRequestException('삭제할 수 없습니다.');
      return userQueryDeleteData;
    } catch (err) {
      throw err;
    }
  }
}

@Injectable()
export class InterviewQuestionService {
  constructor(
    @InjectRepository(UserQuestion)
    private UserQuestionRepository: Repository<UserQuestion>,
    @InjectRepository(UserInterview)
    private UserInterviewRepository: Repository<UserInterview>,
  ) {}

  getInterviewUser(id: number) {
    return this.UserInterviewRepository.createQueryBuilder('ui')
      .select(['ui.userId As userId', 'user.nickname AS userName'])
      .leftJoinAndSelect(User, 'user', 'ui.userId = user.id')
      .where('interviewId = :id AND status = :status', {
        id: id,
        status: UserInterviewStatus.ACCEPTED,
      })
      .getRawMany();
  }

  async create(createUserQuestionData: InterviewQuestionData) {
    try {
      const newUserQuestion = this.UserQuestionRepository.create(
        createUserQuestionData,
      );
      const saveUserQuestion = await this.UserQuestionRepository.save(
        newUserQuestion,
      );
      return { id: saveUserQuestion.id };
    } catch (err) {
      throw err;
    }
  }

  find(interviewId: number, userId: number) {
    const userQuestion = this.UserQuestionRepository.createQueryBuilder()
      .select(['id', 'content AS contents'])
      .where('userId = :userId', { userId: userId })
      .getRawMany();
    return userQuestion;
  }

  async remove(id: number, userId: number) {
    try {
      const userQueryDeleteData =
        await this.UserQuestionRepository.createQueryBuilder('')
          .softDelete()
          .where('id = :id AND userId = :userId', { id: id, userId: userId })
          .execute();
      if (!userQueryDeleteData.affected)
        throw new BadRequestException('삭제할 수 없습니다.');
      return userQueryDeleteData;
    } catch (err) {
      throw err;
    }
  }
}
