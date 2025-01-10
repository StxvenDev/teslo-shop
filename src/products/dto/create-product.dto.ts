import { ApiProperty } from "@nestjs/swagger";
import {IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";



export class CreateProductDto {

    @ApiProperty({
        description: 'This is the title of the product',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'This is the price of the product',
        nullable: false,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;


    @ApiProperty({
        description: 'This is the description of the product',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'This is the slug of the product',
        example: 'product-slug',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'This is the stock of the product',
        nullable: true,
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'This is the sizes of the product',
        nullable: true,
    })
    @IsString({each:true})
    @IsArray()
    sizes: string[];

    @ApiProperty({
        description: 'this is the gender of the product',
        nullable: false,
    })
    @IsIn(['men','women','kids','unisex'])
    gender: string;

    @ApiProperty({
        description: 'This is the tags of the product',
        nullable: true,
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsString({each:true})
    @IsArray()
    @IsOptional()
    images?: string[];
}
