import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entities/item.entity';
import { Resume } from 'src/entities/resume.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateResumeDto } from './dto/create-resume.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Resume) private resumeRepository: Repository<Resume>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  async getUserInfo() {
    try {
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('토큰 인증 실패');
    }
  }

  async getResume(id: number) {
    const itemData = await this.getItem();
    const resumeData = await this.resumeRepository
      .createQueryBuilder('resume')
      .leftJoinAndSelect(Item, 'item', 'resume.itemId = item.id')
      .select([
        'resume.itemId AS itemId',
        'item.title AS item',
        'resume.id AS id',
        'resume.content AS text',
      ])
      .where('resume.userId = :userId', { userId: id })
      .orderBy('resume.itemId')
      .getRawMany();

    const resumeOutputData = { resume: [...itemData] };
    resumeOutputData.resume.forEach((element, index) => {
      resumeOutputData.resume[index]['content'] = [];
    });
    resumeData.forEach((element) => {
      resumeOutputData.resume.forEach((elementItem, index) => {
        if (elementItem['itemId'] === element.itemId) {
          resumeOutputData.resume[index]['content'].push({
            id: element.id,
            text: element.text,
          });
        }
      });
    });
    console.log(resumeOutputData);
    return resumeOutputData;
  }

  async createResume(createResumeDto: CreateResumeDto) {
    const newResume = this.resumeRepository.create(createResumeDto);
    const saveResume = await this.resumeRepository.save(newResume);
    return saveResume;
  }

  async removeResume(id: number, userId: number) {
    try {
      const resumeDeleteData = await this.resumeRepository
        .createQueryBuilder('')
        .softDelete()
        .where('id = :id AND userId = :userId', { id: id, userId: userId })
        .execute();
      if (!resumeDeleteData.affected)
        throw new BadRequestException('삭제할 수 없습니다.');
      return resumeDeleteData;
    } catch (err) {
      throw err;
    }
  }

  getItem() {
    return this.itemRepository
      .createQueryBuilder()
      .select(['id AS itemId', 'title AS item'])
      .getRawMany();
  }
}
