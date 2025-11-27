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
  @ApiQuery({ name: 'userId', required: true, description: 'Conversation partner user id' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Max messages to return (default 50, max 100)',
  })
  @ApiQuery({
    name: 'before',
    required: false,
    description: 'ISO timestamp to fetch messages created before this time',
  })
  @ApiOkResponse({
    type: ViewMessagesResponseDto,
    description: 'Conversation messages',
    examples: {
      default: {
        summary: 'List conversation messages',
        value: {
          message: 'Messages retrieved successfully',
          data: [
            {
              _id: '6761e8b741d4f9b35b3cd123',
              senderId: '507f191e810c19729de860ea',
              receiverId: '507f1f77bcf86cd799439011',
              content: 'Hello!',
              deliveredAt: '2025-11-26T08:20:00.000Z',
              seen: true,
              seenAt: '2025-11-26T08:21:00.000Z',
              createdAt: '2025-11-26T08:19:59.000Z',
            },
          ],
        },
      },
    },
  })
  async viewMessages(
    @GetUser('sub') currentUserId: string,
    @Query() query: ViewMessagesDto,
  ): Promise<ViewMessagesResponseDto> {
    const data = await this.chatService.getConversation(currentUserId, query.userId, {
      limit: query.limit,
      before: query.before,
    });
    return { message: 'Messages retrieved successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  @ApiBody({
    type: SendMessageDto,
    examples: {
      default: {
        summary: 'Send a text message',
        value: { receiverId: '507f191e810c19729de860ea', content: 'Hi there!' },
      },
    },
  })
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
