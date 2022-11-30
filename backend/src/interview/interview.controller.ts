import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { SelectInterviewDto } from './dto/select-interview.dto';
import { JwtGuard } from 'src/guards/jwtAuth.guard';
import { UserInfo } from 'src/interfaces/user.interface';
import { UserData } from 'src/user/user.decorator';

@Controller({ version: '1', path: 'interview' })
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createInterviewDto: CreateInterviewDto,
    @UserData() userData: UserInfo,
  ) {
    createInterviewDto['user'] = userData.id;
    return this.interviewService.create(createInterviewDto);
  }

  @Get()
  findAll(@Query() selectInterviewDto: SelectInterviewDto) {
    return this.interviewService.findQuery(selectInterviewDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewService.findOne(+id);
  }

  @Get('members/:interviewId')
  getMembers(@Param('interviewId') interviewId: string) {
    return this.interviewService.getMembers(interviewId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
  ) {
    return this.interviewService.update(+id, updateInterviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interviewService.remove(+id);
  }
}
