import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max } from 'class-validator';

export class ViewMessagesDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  before?: Date;
}
