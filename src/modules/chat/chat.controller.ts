import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ViewMessagesDto } from './dto/view-messages.dto';
import { Message } from './schemas/message.schema';

@Controller('api')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('viewMessages')
  viewMessages(
    @GetUser('sub') currentUserId: string,
    @Query() query: ViewMessagesDto,
  ): Promise<Message[]> {
    return this.chatService.getConversation(currentUserId, query.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  sendMessage(
    @GetUser('sub') currentUserId: string,
    @Body() payload: SendMessageDto,
  ): Promise<Message> {
    return this.chatService.sendMessage(currentUserId, payload.receiverId, payload.content);
  }
}
