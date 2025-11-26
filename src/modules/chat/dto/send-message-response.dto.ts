import { ApiProperty } from '@nestjs/swagger';
import { Message } from '../schemas/message.schema';

export class SendMessageResponseDto {
  @ApiProperty({ example: 'Message sent successfully' })
  message!: string;

  @ApiProperty({ type: Message })
  data!: Message;
}
