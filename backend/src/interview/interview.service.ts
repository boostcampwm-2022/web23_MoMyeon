import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
  ) {}

  interviewSelect = [
    'id AS interview_id',
    'title',
    'max_member AS maxMember',
    'contact',
    'content',
    'count',
    'status AS recruitStatus',
    'created_at AS date',
    'categoryList AS category',
  ];

  async create(createInterviewDto: CreateInterviewDto) {
    //interview 저장
    const createInterviewData = {
      max_member: createInterviewDto.maxMember,
      ...createInterviewDto,
      categoryList: `${JSON.stringify(createInterviewDto.category)}`,
    };
    const newInterview = this.interviewRepository.create(createInterviewData);
    const saveInterview = await this.interviewRepository.save(newInterview);
    const interviewId = saveInterview.id;

    //interviewCategory 저장
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
  }

  async findQuery(selectInterviewDto: SelectInterviewDto) {
    const limit = 18;
    const selectInterviewData = {
      page: selectInterviewDto.page || 0,
      search: selectInterviewDto.search || '',
      category: selectInterviewDto.category || '',
    };
    //자료형 변환
    const category: number[] = [];
    if (selectInterviewData.category !== '') {
      selectInterviewData.category.split(',').forEach((element) => {
        category.push(parseInt(element));
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
      where.sql = '(title LIKE (:search) OR contact LIKE (:search))';
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
      .createQueryBuilder()
      .select(this.interviewSelect)
      .where(where.sql, where.value)
      .orderBy('date', 'DESC')
      .limit(limit)
      .offset(limit * selectInterviewData.page)
      .getRawMany();
    const endTime = new Date().getTime();
    //출력형태 조정
    interviewData.forEach((element) => {
      element.category = JSON.parse(element.category);
    });
    return { queryTime: endTime - startTime, interviews: interviewData };
  }

  async findOne(id: number) {
    //interview 정보
    const interviewData = await this.interviewRepository
      .createQueryBuilder()
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

    //user_interview에 따라서 member, isHost, userStatus 로직 추가 필요
    interviewData['member'] = undefined;
    interviewData['isHost'] = undefined;
    interviewData['userStatus'] = undefined;
    //0: 신청하기 전 1: 신청 후 승인 대기중 2: 승인 3: 거부
    return { interviewData };
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
        return { ...member, resume: found ?? [] };
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

  async update(id: number, updateInterviewDto: UpdateInterviewDto) {
    //interview 저장
    //기존과 인원이 바꾸려고 할 때, 신청자 승인자 보다 적게는 수정이 불가하도록
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
      .createQueryBuilder('users')
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
  }

  remove(id: number) {
    return this.interviewRepository.softDelete(id);
  }
}
