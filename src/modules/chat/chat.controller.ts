import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ViewMessagesDto } from './dto/view-messages.dto';
import { ViewMessagesResponseDto } from './dto/view-messages-response.dto';
import { SendMessageResponseDto } from './dto/send-message-response.dto';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('api')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('viewMessages')
  @ApiQuery({ name: 'userId', required: true })
  @ApiOkResponse({
    type: ViewMessagesResponseDto,
    description: 'Conversation messages',
  })
  async viewMessages(
    @GetUser('sub') currentUserId: string,
    @Query() query: ViewMessagesDto,
  ): Promise<ViewMessagesResponseDto> {
    const data = await this.chatService.getConversation(currentUserId, query.userId);
    return { message: 'Messages retrieved successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  @ApiBody({ type: SendMessageDto })
  @ApiOkResponse({ type: SendMessageResponseDto, description: 'Sent message' })
  async sendMessage(
    @GetUser('sub') currentUserId: string,
    @Body() payload: SendMessageDto,
  ): Promise<SendMessageResponseDto> {
    const data = await this.chatService.sendMessage(
      currentUserId,
      payload.receiverId,
      payload.content,
    );
    return { message: 'Message sent successfully', data };
  }
}
