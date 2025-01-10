import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({name:'products'})
export class Product {

    @ApiProperty({
        example: 'uuid',
        description: 'This is the unique id of the product',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-shirt',
        description: 'This is the title of the product',
        uniqueItems: true
    })
    @Column('text',{
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 20.00,
        description: 'This is the price of the product',
    })
    @Column('numeric',{
        default: 0
    })
    price: number
    
    @ApiProperty({
        example: 'This is a T-shirt',
        description: 'This is the description of the product',
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't-shirt',
        description: 'This is the slug of the product',
    })
    @Column('text', {
        unique: true
    })
    slug: string

    @ApiProperty({
        example: 10,
        description: 'This is the stock of the product',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number

    @ApiProperty({
        example: ['M','S','L'],
        description: 'This is the sizes of the product',
    })
    @Column('text',{
        array: true
    })
    sizes: string[]

    @ApiProperty({
        example: 'women',
        description: 'product gender'
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['t-shirt','clothes','fashion'],
        description: 'product tags'
    })
    @Column('text',{
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty({
        example: 'https://www.google.com',
        description: 'This is the link to the product',
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {cascade: true, eager: true}
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User

    @BeforeInsert()
    checkSlugInsert(){
        if( !this.slug ){
            this.slug = this.title
        }
        this.slug = this.slug
                .toLocaleLowerCase()
                .replaceAll(' ','_')
                .replaceAll("'",'');
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
                .toLocaleLowerCase()
                .replaceAll(' ','_')
                .replaceAll("'",'');
    }
}


