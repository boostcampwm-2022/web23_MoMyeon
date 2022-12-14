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
import {
  InterviewStatus,
  UserInterviewStatus,
} from 'src/enum/userInterviewStatus.enum';
import { User } from 'src/entities/user.entity';
import { QuestionType } from 'src/enum/questionType.enum';
import { CreateUserQuestionDto } from './dto/create-user-question.dto';
import { UserQuestion } from 'src/entities/userQuestion.entity';
import { InterviewQuestionData } from 'src/interfaces/question.interface';
import { InterviewQuestion } from 'src/entities/interviewQuestion.entity';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { UserInfo } from 'src/interfaces/user.interface';
import {
  QuestionFeedback,
  QuestionResult,
} from 'src/interfaces/question.interface';

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
    @InjectRepository(InterviewQuestion)
    private InterviewQuestionRepository: Repository<InterviewQuestion>,
    @InjectRepository(UserInterview)
    private UserInterviewRepository: Repository<UserInterview>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  create(createQuestionDto: CreateQuestionDto) {
    return 'This action adds a new question';
  }

  findAll() {
    return this.simpleQuestionRepository.createQueryBuilder().getRawMany();
  }

  /**
   * 3?????? ?????? ??? ?????? ??????
   * @param id interview ??????
   * @returns ?????? ?????????
   */
  async findTemporaryRoomQuestion(id: number) {
    // userId??? ????????? ?????? ????????? ??????(?????? ?????? ??????)

    // 0. id -> interview(????????? ????????????)
    const interviewData = await this.interviewRepository
      .createQueryBuilder()
      .where({ id })
      .getRawOne();
    //category ??????
    const categoryData = await this.interviewCategoryRepository
      .createQueryBuilder('ic')
      .leftJoinAndSelect(Category, 'category', 'ic.categoryId = category.id')
      .select(['category.id AS id', 'category.name AS name'])
      .where('ic.interviewId = :id', { id: id })
      .getRawMany();

    // 1. id -> user_interview(?????? ??????)
    const userInterviewData = await this.userInterviewRepository
      .createQueryBuilder('ui')
      .leftJoinAndSelect(User, 'user', 'ui.userId = user.id')
      .select(['ui.userId AS userId', 'user.nickname AS userName'])
      .where('interviewId = :id AND status = :status', {
        id: id,
        status: UserInterviewStatus.ACCEPTED,
      })
      .getRawMany();

    // 2. ?????? ?????? ???????????? ???????????? ???????????? ????????????
    const where = { sql: `categoryId = 14 `, value: {} };
    categoryData.forEach((element) => {
      where.sql += `OR categoryId = ${element.id} `;
    });
    const simpleQuestionData = await this.simpleQuestionRepository
      .createQueryBuilder()
      .select(['id', 'content AS contents'])
      .where(where.sql)
      .getRawMany();
    //3. ????????????
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

  async findRoomQuestion(
    interviewId: number,
    userData: UserInfo,
  ): Promise<QuestionResult[]> {
    // 0. ?????? ?????? ?????? ?????? redis ???????????? (????????? ??????)
    const result = await this.redis.hgetall(`question:${interviewId}`);
    if (Object.keys(result).length) {
      const questions = this.extractQuestions(result);
      return questions;
    }

    // ??? ???????????? ?????? ?????? ???????????? ??????\
    const [interview] = await this.interviewRepository.findBy({
      id: interviewId,
    });
    if (interview.status !== InterviewStatus.FEEDBACK) {
      await this.interviewRepository.update(interviewId, {
        status: InterviewStatus.ENDED,
      });
    }

    // 1. ?????? ?????? ???????????? ???????????? ???????????? ????????????
    const categoryData = await this.interviewCategoryRepository
      .createQueryBuilder('ic')
      .leftJoinAndSelect(Category, 'category', 'ic.categoryId = category.id')
      .select(['category.id AS id', 'category.name AS name'])
      .where('ic.interviewId = :id', { id: interviewId })
      .getRawMany();

    // 2. ?????? ?????? ???????????? ???????????? ???????????? ????????????
    const where = { sql: `categoryId = 14 `, value: {} };
    categoryData.forEach((element) => {
      where.sql += `OR categoryId = ${element.id} `;
    });
    const simpleQuestionData = await this.simpleQuestionRepository
      .createQueryBuilder()
      .select(['id', 'content'])
      .where(where.sql)
      .orderBy('RAND()')
      .getRawMany();

    // 3. id -> user_interview(?????? ??????) -> interview_question(???????????? ??? ????????????)
    const userInterviewQuestionData = { questions: [] };
    const interviewUser = await this.UserInterviewRepository.createQueryBuilder(
      'ui',
    )
      .select(['ui.userId As userId', 'user.nickname AS userName'])
      .leftJoinAndSelect(User, 'user', 'ui.userId = user.id')
      .where('interviewId = :id AND status = :status', {
        id: interviewId,
        status: UserInterviewStatus.ACCEPTED,
      })
      .getRawMany();
    const userInterviewQuestion =
      await this.InterviewQuestionRepository.createQueryBuilder()
        .select(['user_to AS userTo', 'userId', 'id', 'content'])
        .where('interviewId = :interviewId', {
          interviewId: interviewId,
        })
        .getRawMany();
    interviewUser.forEach((userElement) => {
      const temp = [];
      userInterviewQuestion.forEach((questionElement) => {
        if (userElement.userId === questionElement.userTo) {
          temp.push({
            type: QuestionType.INTERVIEW,
            id: questionElement.id,
            content: questionElement.content,
            feedback: '',
          });
        }
      });
      simpleQuestionData.forEach((simpleElement) => {
        if (temp.length < 20) {
          temp.push({
            type: QuestionType.SIMPLE,
            id: simpleElement.id,
            content: simpleElement.content,
            feedback: '',
          });
        }
      });
      userInterviewQuestionData.questions.push({
        userId: userElement.userId,
        userName: userElement.userName,
        question: temp,
      });
    });

    // N?????? ????????? ?????? M?????? ????????? ????????? ?????? ?????? redis??? ??????
    const promises: Promise<number>[][] =
      userInterviewQuestionData.questions.map((user) => {
        const { userId, userName } = user;

        return user.question.map((question) => {
          const { type, id, content } = question;

          return this.redis.hset(
            `question:${interviewId}`,
            `${userData.id}:${userId}:${type}:${id}`,
            JSON.stringify({
              fromName: userData.nickname,
              toName: userName,
              feedback: '',
              questionContent: content,
            }),
          );
        });
      });
    await Promise.all(promises.map(Promise.all.bind(Promise)));

    const savedQuestions = await this.redis.hgetall(`question:${interviewId}`);
    return this.extractQuestions(savedQuestions);
  }

  extractQuestions(result: any): QuestionResult[] {
    const entries = Object.entries(result);
    const questions: QuestionResult[] = entries.reduce(
      (acc: any, [key, value]: any) => {
        const [toId, type, questionId] = key
          .split(':')
          .map((n) => +n)
          .slice(1);
        const { toName, feedback, questionContent } = JSON.parse(value);

        const found: QuestionResult = acc.find(
          (userTo) => userTo.userId === toId,
        );
        const questionFeedback: QuestionFeedback = {
          type,
          id: questionId,
          content: questionContent,
          feedback,
        };
        const questionResult: QuestionResult = {
          userId: toId,
          userName: toName,
          question: [questionFeedback],
        };

        if (!found) {
          acc.push(questionResult);
          return acc;
        }

        found.question.push(questionFeedback);
        return acc;
      },
      [],
    );

    return questions;
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
        throw new BadRequestException('?????? ????????? ???????????????.');
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
        throw new BadRequestException('????????? ??? ????????????.');
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
    @InjectRepository(InterviewQuestion)
    private InterviewQuestionRepository: Repository<InterviewQuestion>,
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
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

  async create(createInterviewQuestionData: InterviewQuestionData) {
    try {
      //isStart check
      const result = await this.redis.hgetall(
        `question:${createInterviewQuestionData.interviewId}`,
      );
      if (Object.keys(result).length > 0) {
        throw new BadRequestException(
          '??????????????? ???????????? ????????? ????????? ??? ????????????.',
        );
      }
      const [interview] = await this.interviewRepository.findBy({
        id: createInterviewQuestionData.interviewId,
      });
      if (interview.status === InterviewStatus.FEEDBACK) {
        throw new BadRequestException(
          '???????????? ???????????? ????????? ????????? ??? ????????????.',
        );
      }
      const newUserInterviewQuestion = this.InterviewQuestionRepository.create(
        createInterviewQuestionData,
      );
      const saveUserInterviewQuestion =
        await this.InterviewQuestionRepository.save(newUserInterviewQuestion);
      return saveUserInterviewQuestion;
    } catch (err) {
      throw err;
    }
  }

  async find(interviewId: number, userId: number) {
    const userInterviewQuestionData = { questions: [] };
    const interviewUser = await this.getInterviewUser(interviewId);
    const userInterviewQuestion =
      await this.InterviewQuestionRepository.createQueryBuilder()
        .select(['user_to AS userTo', 'userId', 'id', 'content'])
        .where('interviewId = :interviewId AND userId = :userId', {
          interviewId: interviewId,
          userId: userId,
        })
        .getRawMany();
    interviewUser.forEach((userElement) => {
      const temp = [];
      userInterviewQuestion.forEach((questionElement) => {
        if (userElement.userId === questionElement.userTo) {
          temp.push({
            id: questionElement.id,
            content: questionElement.content,
            feedback: '',
          });
        }
      });
      userInterviewQuestionData.questions.push({
        userId: userElement.userId,
        userName: userElement.userName,
        question: temp,
      });
    });
    return userInterviewQuestionData;
  }

  async remove(id: number, userId: number) {
    try {
      const userInterview =
        await this.InterviewQuestionRepository.createQueryBuilder()
          .select(['interviewId'])
          .where('id = :id AND userId = :userId', {
            id: id,
            userId: userId,
          })
          .getRawOne();
      //isStart check
      const result = await this.redis.hgetall(
        `question:${userInterview.interviewId}`,
      );
      if (Object.keys(result).length > 0) {
        throw new BadRequestException(
          '??????????????? ???????????? ????????? ????????? ??? ????????????.',
        );
      }
      const [interview] = await this.interviewRepository.findBy({
        id: userInterview.interviewId,
      });
      if (interview.status === InterviewStatus.FEEDBACK) {
        throw new BadRequestException(
          '???????????? ???????????? ????????? ????????? ??? ????????????.',
        );
      }
      const userQueryDeleteData =
        await this.InterviewQuestionRepository.createQueryBuilder('')
          .softDelete()
          .where('id = :id AND userId = :userId', { id: id, userId: userId })
          .execute();
      if (!userQueryDeleteData.affected)
        throw new BadRequestException('????????? ??? ????????????.');
      return userQueryDeleteData;
    } catch (err) {
      throw err;
    }
  }
}
