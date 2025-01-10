import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

  @ApiProperty({
    example: 'uuid',
    description: 'This is the unique id of the user',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'test@mail.com',
    description: 'This is the email of the user',
    uniqueItems: true
  })
  @Column('text',{
    unique: true
  })
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'This is the password of the user',
  })
  @Column('text',{
    select: false
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'This is the full name of the user',
  })  
  @Column('text')
  fullName: string;

  @ApiProperty({
    example: 'true',
    description: 'This is the status of the user',
  })
  @Column('bool',{
    default: true
  })
  isActive: boolean;

  @ApiProperty({
    example: ['user','admin'],
    description: 'This is the roles of the user',
  })
  @Column('text',{
    array:  true,
    default: ['user']
  })
  roles: string[];

  @OneToMany(
    () => Product,
    ( product ) => product.user
  )
  product: Product;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
