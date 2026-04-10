import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, IsNumber } from "class-validator";

export class UpdateUserStatusDto {
  @IsIn(["ACTIVE", "MUTED", "BANNED"])
  status!: "ACTIVE" | "MUTED" | "BANNED";
}

export class UpdatePostStatusDto {
  @IsIn(["PUBLISHED", "OFFLINE", "PENDING_REVIEW"])
  status!: "PUBLISHED" | "OFFLINE" | "PENDING_REVIEW";

  @IsOptional()
  @IsString()
  reviewReason?: string;
}

export class UpdateReportStatusDto {
  @IsIn(["PENDING", "IN_PROGRESS", "REJECTED", "PUNISHED", "CLOSED"])
  status!: "PENDING" | "IN_PROGRESS" | "REJECTED" | "PUNISHED" | "CLOSED";

  @IsOptional()
  @IsString()
  handleNote?: string;
}

export class ManageCategoryDto {
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ManageChannelDto {
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
