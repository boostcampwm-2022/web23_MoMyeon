import { Controller, Get } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller({ version: '1', path: 'feedback' })
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  test() {
    return this.feedbackService.test();
  }
}
