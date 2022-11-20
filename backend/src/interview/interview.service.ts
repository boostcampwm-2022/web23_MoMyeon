import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Interview } from 'src/entities/interview.entity';
import { Category } from 'src/entities/category.entity';
import { InterviewCategory } from 'src/entities/interviewCategory.entity';
import { UserInterview } from 'src/entities/userInterview.entity';
import { SelectInterviewDto } from './dto/select-interview.dto';

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
  ) {}

  async create(createInterviewDto: CreateInterviewDto) {
    //interview 저장
    createInterviewDto.max_member = createInterviewDto.maxMember;
    createInterviewDto.categoryList = `${JSON.stringify(
      createInterviewDto.category,
    )}`;
    const newInterview = this.interviewRepository.create(createInterviewDto);
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
    //자료형 변환
    const category = [] as number[];
    if (selectInterviewDto.category !== '') {
      selectInterviewDto.category.split(',').forEach((element) => {
        category.push(parseInt(element));
      });
    }

    const where = { sql: ``, value: {} };
    if (selectInterviewDto.search === '' && category.length > 0) {
      category.forEach((element, index) => {
        where.sql +=
          index === 0
            ? `categoryList LIKE '%:${element},%'`
            : `OR categoryList LIKE '%:${element},%'`;
      });
    } else if (selectInterviewDto.search !== '' && category.length === 0) {
      where.sql = '(title LIKE (:search) OR contact LIKE (:search))';
      where.value = {
        search: `%${selectInterviewDto.search}%`,
      };
    } else if (selectInterviewDto.search !== '' && category.length > 0) {
      where.sql = '(title LIKE (:search) OR contact LIKE (:search))';
      where.value = {
        search: `%${selectInterviewDto.search}%`,
      };
      category.forEach((element, index) => {
        where.sql +=
          index === 0
            ? `AND (categoryList LIKE '%:${element},%'`
            : `OR categoryList LIKE '%:${element},%'`;
      });
      where.sql += ')';
    }
    const interviewData = await this.interviewRepository
      .createQueryBuilder()
      .select([
        'id AS interview_id',
        'title',
        'max_member AS maxMember',
        'contact',
        'content',
        // 'count',
        // 'status AS recruitStatus',
        'created_at AS date',
        'categoryList AS category',
      ])
      .where(where.sql, where.value)
      .orderBy('date', 'DESC')
      .limit(limit)
      .offset(limit * selectInterviewDto.page)
      .getRawMany();

    //출력형태 조정
    interviewData.forEach((element) => {
      element.category = JSON.parse(element.category);
    });
    return interviewData;
  }

  async findOne(id: number) {
    //interview 정보
    const interviewData = await this.interviewRepository
      .createQueryBuilder()
      .select([
        'id AS interview_id',
        'title',
        'max_member AS maxMember',
        'contact',
        'content',
        // 'count',
        // 'status AS recruitStatus',
        'created_at AS date',
      ])
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
    return { interviewData };
  }

  async update(id: number, updateInterviewDto: UpdateInterviewDto) {
    //interview 저장
    updateInterviewDto.max_member = updateInterviewDto.maxMember;
    const category = updateInterviewDto.category;
    delete updateInterviewDto['maxMember'];
    delete updateInterviewDto['category'];
    this.interviewRepository.update(id, updateInterviewDto);

    //interviewCategory 삭제
    this.interviewCategoryRepository
      .createQueryBuilder('users')
      .softDelete()
      .where('interviewId = :id', { id: id })
      .execute();

    //interviewCategory 저장
    category.forEach((element) => {
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
