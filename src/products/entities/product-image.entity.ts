import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({name:'productsImages'})
export class ProductImage {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('text')
  url: string;

  @ManyToOne(
    () => Product,
    (product) => product.id,
    {onDelete : 'CASCADE'}
  )
  product : Product;

}