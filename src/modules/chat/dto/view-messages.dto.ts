import { IsNotEmpty, IsString } from 'class-validator';

export class ViewMessagesDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;
}
