import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto{

  @ApiProperty({
    description: 'This is the email of the user',
    nullable: false,
  })
  @IsString()
  @IsEmail()
  email: string;


  @ApiProperty({
    description: 'This is the password of the user',
    nullable: false,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
})
  password: string;

}