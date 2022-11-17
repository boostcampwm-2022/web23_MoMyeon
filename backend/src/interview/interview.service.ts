import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Interview } from 'src/entities/interview.entity';
import { Category } from 'src/entities/category.entity';
import { InterviewCategory } from 'src/entities/interviewCategory.entity';
import { UserInterview } from 'src/entities/userInterview.entity';

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

  findAll() {
    return `This action returns all interview`;
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

  update(id: number, updateInterviewDto: UpdateInterviewDto) {
    return `This action updates a #${id} interview`;
  }

  remove(id: number) {
    return `This action removes a #${id} interview`;
  }
}
