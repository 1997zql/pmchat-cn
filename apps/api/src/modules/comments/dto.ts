import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}
