import { ApiProperty } from '@nestjs/swagger';
import { Message } from '../schemas/message.schema';

export class ViewMessagesResponseDto {
  @ApiProperty({ example: 'Messages retrieved successfully' })
  message!: string;

  @ApiProperty({ type: Message, isArray: true })
  data!: Message[];
}
