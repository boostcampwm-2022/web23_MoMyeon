import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwtAuth.guard';
import { UserInfo } from 'src/interfaces/user.interface';
import { UserData } from 'src/user/user.decorator';
import { SaveFeedbackDto } from './dto/save-feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller({ version: '1', path: 'feedback' })
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Patch(':interviewId')
  @UseGuards(JwtGuard)
  async saveFeedback(
    @Param('interviewId') interviewId: string,
    @Body() saveFeedbackDto: SaveFeedbackDto,
    @UserData() userData: UserInfo,
  ) {
    await this.feedbackService.saveFeedback(
      +interviewId,
      saveFeedbackDto,
      userData,
    );
    return { message: 'success' };
  }

  @Post(':interviewId')
  async saveAllFeedback(@Param('interviewId') interviewId: string) {
    await this.feedbackService.saveAllFeedback(+interviewId);
    return { message: 'success' };
  }

  // @Get(':interviewId')
  // @UseGuards(JwtGuard)
  // getAllFeedbacks(@Param('interviewId') interviewId: string) {
  //   return this.feedbackService.getAllFeedbacks(interviewId);
  // }
}
