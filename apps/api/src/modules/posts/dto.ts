import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  content!: string;

  @IsString()
  categoryId!: string;

  @IsIn(["ARTICLE", "QUESTION", "DISCUSSION"])
  type!: "ARTICLE" | "QUESTION" | "DISCUSSION";

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  coverUrl?: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  coverUrl?: string;
}

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  reason!: string;

  @IsOptional()
  @IsString()
  detail?: string;
}
