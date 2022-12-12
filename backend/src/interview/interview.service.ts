import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Interview } from 'src/entities/interview.entity';
import { Category } from 'src/entities/category.entity';
import { InterviewCategory } from 'src/entities/interviewCategory.entity';
import { UserInterview } from 'src/entities/userInterview.entity';
import { SelectInterviewDto } from './dto/select-interview.dto';
import { User } from 'src/entities/user.entity';
import { Resume } from 'src/entities/resume.entity';
import { Item } from 'src/entities/item.entity';
import {
  InterviewStatus,
  UserInterviewStatus,
} from 'src/enum/userInterviewStatus.enum';
import { UserInfo } from 'src/interfaces/user.interface';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(InterviewCategory)
    private interviewCategoryRepository: Repository<InterviewCategory>,
    @InjectRepository(UserInterview)
    private userInterviewRepository: Repository<UserInterview>,
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  interviewSelect = [
    'interview.id AS interview_id',
    'interview.title AS title',
    'interview.max_member AS maxMember',
    'interview.contact AS contact',
    'interview.content AS content',
    'interview.count AS count',
    'interview.status AS recruitStatus',
    'interview.created_at AS date',
    'interview.categoryList AS category',
    'user.nickname AS host',
  ];

  async create(createInterviewDto: CreateInterviewDto) {
    try {
      const createInterviewData = {
        max_member: createInterviewDto.maxMember,
        ...createInterviewDto,
        categoryList: `${JSON.stringify(createInterviewDto.category)}`,
      };

      const validateCategory = await this.validateCategory(
        createInterviewDto.category,
      );
      if (!validateCategory) {
        throw new BadRequestException('카테고리 입력에 이상이 있습니다.');
      }
      if (
        createInterviewDto.maxMember > 6 ||
        createInterviewDto.maxMember < 1
      ) {
        throw new BadRequestException('인원에 이상이 있습니다.');
      }

      const newInterview = this.interviewRepository.create(createInterviewData);
      const saveInterview = await this.interviewRepository.save(newInterview);
      const interviewId = saveInterview.id;

      createInterviewDto.category.forEach((element) => {
        const createInterviewCategoryData: object = {
          interview: interviewId,
          category: element.id,
        };
        const newInterviewCategory = this.interviewCategoryRepository.create(
          createInterviewCategoryData,
        );
        this.interviewCategoryRepository.save(newInterviewCategory);
      });

      return { id: interviewId };
    } catch (err) {
      throw err;
    }
  }

  async findQuery(selectInterviewDto: SelectInterviewDto) {
    try {
      const INFINITY_SCROLL_LIMIT = 18;
      const selectInterviewData = {
        page: selectInterviewDto.page || 0,
        search: selectInterviewDto.search || '',
        category: selectInterviewDto.category || '',
      };

      //자료형 변환
      const category: number[] = [];
      if (selectInterviewData.category !== '') {
        const categoryId = selectInterviewData.category.match(
          /(?<=\[)(.*?)(?=\])/,
        )
          ? selectInterviewData.category.match(/(?<=\[)(.*?)(?=\])/)[0]
          : selectInterviewData.category;
        categoryId.split(',').forEach((element) => {
          if (parseInt(element)) category.push(parseInt(element));
        });
      }

      const where = { sql: ``, value: {} };
      if (selectInterviewData.search === '' && category.length > 0) {
        category.forEach((element, index) => {
          where.sql +=
            index === 0
              ? `categoryList LIKE '%:${element},%'`
              : `OR categoryList LIKE '%:${element},%'`;
        });
      } else if (selectInterviewData.search !== '' && category.length === 0) {
        where.sql = '(title LIKE (:search) OR contact LIKE (:search))';
        where.value = {
          search: `%${selectInterviewData.search}%`,
        };
      } else if (selectInterviewData.search !== '' && category.length > 0) {
        where.sql = '(title LIKE (:search) OR contact LIKE (:search)) ';
        where.value = {
          search: `%${selectInterviewData.search}%`,
        };
        category.forEach((element, index) => {
          where.sql +=
            index === 0
              ? `AND (categoryList LIKE '%:${element},%'`
              : `OR categoryList LIKE '%:${element},%'`;
        });
        where.sql += ')';
      }

      const startTime = new Date().getTime();
      const interviewData = await this.interviewRepository
        .createQueryBuilder('interview')
        .innerJoinAndSelect(User, 'user', 'interview.userId = user.id')
        .select(this.interviewSelect)
        .where(where.sql, where.value)
        .orderBy('date', 'DESC')
        .limit(INFINITY_SCROLL_LIMIT)
        .offset(INFINITY_SCROLL_LIMIT * selectInterviewData.page)
        .getRawMany();
      const endTime = new Date().getTime();

      //출력형태 조정
      if (interviewData.length) {
        interviewData.forEach((element) => {
          if (element.category) element.category = JSON.parse(element.category);
        });
      }
      return { queryTime: endTime - startTime, interviews: interviewData };
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: number) {
    //interview 정보
    const interviewData = await this.interviewRepository
      .createQueryBuilder('interview')
      .leftJoin(User, 'user', 'interview.userId = user.id')
      .select(this.interviewSelect)
      .where({ id })
      .getRawOne();
    interviewData['date'] = new Date(interviewData['date']);

    //category 정보
    const categoryData = await this.interviewCategoryRepository
      .createQueryBuilder('ic')
      .leftJoinAndSelect(Category, 'category', 'ic.categoryId = category.id')
      .select(['category.id AS id', 'category.name AS name'])
      .where('ic.interviewId = :id', { id: id })
      .getRawMany();
    interviewData['category'] = categoryData;

    const interviewMember = await this.interviewMember(id);
    interviewData['member'] = +interviewMember.get(
      UserInterviewStatus.ACCEPTED,
    );
    interviewData['isHost'] = false;
    interviewData['userStatus'] = 0;
    //0: 신청하기 전 1: 신청 후 승인 대기중 2: 승인 3: 거부
    return { interviewData };
  }

  async loginFindOne(id: number, userId: number, userName: string) {
    //interview 정보
    const { interviewData } = await this.findOne(id);
    const userStatus = await this.userInterviewRepository
      .createQueryBuilder()
      .select('status')
      .where('interviewId = :id AND userId = :userId', {
        id: id,
        userId: userId,
      })
      .getRawOne();
    interviewData['isHost'] = interviewData.host === userName;
    interviewData['userStatus'] = (userStatus && userStatus.status) || 0;
    return { interviewData };
  }

  async userInterviewStatus(id: number, userId: number, userName: string) {
    //interview 정보
    try {
      const { interviewData } = await this.findOne(id);

      const userStatus = await this.userInterviewRepository
        .createQueryBuilder()
        .select('status')
        .where('interviewId = :id AND userId = :userId', {
          id: id,
          userId: userId,
        })
        .getRawOne();

      interviewData['isHost'] = interviewData.host === userName;
      interviewData['userStatus'] = (userStatus && userStatus.status) || 0;

      // 모의면접 시작 여부
      const result = await this.redis.hgetall(`question:${id}`);
      const isStart = Object.keys(result).length > 0;

      return {
        isHost: interviewData.isHost,
        userStatus: interviewData.userStatus,
        isStart: isStart,
        interviewStatus: interviewData.recruitStatus,
      };
    } catch (error) {
      throw new BadRequestException('해당 인터뷰 정보가 없습니다.');
    }
  }

  async getMembers(interviewId: string) {
    // 모의면접 신청이 승인된 멤버들 조회 + 멤버들의 이력서 조회
    try {
      const members = await this.userInterviewRepository
        .createQueryBuilder('ui')
        .innerJoinAndSelect(User, 'user', 'ui.userId = user.id')
        .where('ui.interviewId = :id', { id: interviewId })
        .select(['user.id as userId', 'nickname'])
        .getRawMany();

      if (!members.length) {
        return { members };
      }

      const memberIds = members.map((member) => member.userId + '');
      const rawResumes = await this.resumeRepository
        .createQueryBuilder('resume')
        .innerJoinAndSelect(Item, 'item', 'resume.itemId = item.id')
        .where('resume.userId in (:id)', { id: memberIds })
        .select(['resume.userId as userId', 'title', 'content'])
        .getRawMany();

      const resumes = this.extractResumes(rawResumes);
      const membersData = members.map((member) => {
        const found = Object.entries(resumes).find(
          ([rid]) => +rid === member.userId,
        );
        return { ...member, resume: found ? found[1] : [] };
      });

      return membersData;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('DB 오류');
    }
  }

  extractResumes(rawResumes) {
    return rawResumes.reduce((acc, cur) => {
      const { userId, title, content } = cur;
      if (!acc[userId]) {
        acc[userId] = [{ title, content }];
        return acc;
      }

      const [found] = acc[userId].filter(
        ({ title: _title }) => _title === title,
      );

      if (!found) {
        acc[userId].push({ title, content });
        return acc;
      }
      if (!found.content) found.content = content;
      else found.content += '\n' + content;
      return acc;
    }, {});
  }

  async update(
    id: number,
    userId: number,
    updateInterviewDto: UpdateInterviewDto,
  ) {
    try {
      const validateCategory = await this.validateCategory(
        updateInterviewDto.category,
      );
      if (!validateCategory) {
        throw new BadRequestException('카테고리 입력에 이상이 있습니다.');
      }

      const updateInterviewData = {
        title: updateInterviewDto.title,
        max_member: updateInterviewDto.maxMember,
        contact: updateInterviewDto.contact,
        content: updateInterviewDto.content,
        categoryList: `${JSON.stringify(updateInterviewDto.category)}`,
      };
      this.interviewRepository.update(id, updateInterviewData);

      //interviewCategory 삭제
      this.interviewCategoryRepository
        .createQueryBuilder()
        .softDelete()
        .where('interviewId = :id', { id: id })
        .execute();

      //interviewCategory 저장
      updateInterviewDto.category.forEach((element) => {
        const createInterviewCategoryData: object = {
          interview: id,
          category: element.id,
        };
        const newInterviewCategory = this.interviewCategoryRepository.create(
          createInterviewCategoryData,
        );
        this.interviewCategoryRepository.save(newInterviewCategory);
      });
      return { interview_id: id };
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number, userId: number) {
    try {
      const interviewDeleteData = await this.interviewRepository
        .createQueryBuilder('')
        .softDelete()
        .where('id = :id AND userId = :userId', { id: id, userId: userId })
        .execute();
      if (!interviewDeleteData.affected)
        throw new BadRequestException('삭제할 수 없습니다.');
      return interviewDeleteData;
    } catch (err) {
      throw err;
    }
  }

  async validateCategory(categoryList: any) {
    const category = await this.categoryRepository.find({
      select: { id: true, name: true },
    });
    const map = new Map();
    category.forEach((element) => {
      map.set(element.id, element.name);
    });
    let check = true;
    categoryList.forEach((element) => {
      check = check && map.get(element.id) === element.name;
    });
    return check;
  }

  async interviewMember(interviewId: number) {
    const userInterviewData = await this.userInterviewRepository
      .createQueryBuilder()
      .where('interviewId = (:id)', { id: interviewId })
      .select('status AS status')
      .addSelect('COUNT(*) AS count')
      .groupBy('status')
      .getRawMany();
    const map = new Map();
    userInterviewData.forEach((element) => {
      map.set(element.status, element.count);
    });
    return map;
  }

  async applyInterview(interviewId: number, userData: UserInfo) {
    try {
      const { id: userId } = userData;
      const [interview] = await this.interviewRepository.findBy({
        id: interviewId,
      });
      const { current_member, max_member } = interview;

      if (current_member >= max_member) {
        throw new ForbiddenException('면접 인원 정원 초과');
      }

      const [exRecord] = await this.userInterviewRepository.findBy({
        userId,
        interviewId,
      });
      if (exRecord) throw new ForbiddenException('이미 신청했습니다.');

      const userInterview = this.userInterviewRepository.create({
        userId,
        interviewId,
        status: UserInterviewStatus.ACCEPTED,
      });

      await this.userInterviewRepository.save(userInterview);

      await this.interviewRepository.update(interviewId, {
        current_member: current_member + 1,
        status:
          current_member + 1 === max_member
            ? InterviewStatus.ENDED
            : InterviewStatus.RECRUITING,
      });

      return true;
    } catch (err) {
      console.error(err);
      if (err.status !== HttpStatus.FORBIDDEN) {
        throw new InternalServerErrorException('DB 작업 실패');
      }
      throw err;
    }
  }
}
