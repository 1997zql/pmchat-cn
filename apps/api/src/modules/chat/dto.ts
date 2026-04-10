import { IsNotEmpty } from "class-validator";

export class CreateChatMessageDto {
  @IsNotEmpty()
  content!: string;
}
