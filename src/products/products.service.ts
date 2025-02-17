import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryBuilder, Repository } from 'typeorm';
import {validate as isUUID} from 'uuid';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ProductImage, Product } from './entities';
import { User } from 'src/auth/entities/user.entity';
import { use } from 'passport';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource, 
  ){}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const {images = [], ...productDetails} = createProductDto;
      const product = this.productRepository.create({
        ...createProductDto,
        images: images.map( image => this.productImageRepository.create({url:image})),
        user
      });
      await this.productRepository.save(product);
      return {...product, images};
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto : PaginationDto) {
    try {
      const {limit = 10, offset = 0} = paginationDto;
      const products = await this.productRepository.find({
        take: limit, 
        skip: offset,
        relations: {
          images: true
        }
      });
      return products.map( product => ({
        ...product,
        images: product.images.map(img => img.url)
      }));
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
      let product : Product;
      if(isUUID(term)){
        product = await this.productRepository.findOneBy({id:term});
      }else{
        const queryBuilder = this.productRepository.createQueryBuilder('prod');
        product = await queryBuilder.where('title ILIKE :title or slug =:slug',{
          title: term,
          slug: term
        })
        .leftJoinAndSelect('prod.images','prodImages')
        .getOne();
      }
      // const product = await this.productRepository.findOneBy({id});
      if( !product )
        throw new NotFoundException(`product with ${term} not found`)
      return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const {images, ...toUpdate} = updateProductDto;
    const product = await this.productRepository.preload({ id, ...toUpdate })
    if(!product) throw new NotFoundException();
    // Query Runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if(images){
        await queryRunner.manager.delete(ProductImage,{product : { id }})
      }
      product.images = images.map(image => (
        this.productImageRepository.create({ url : image })
      ))
      product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.manager.release();
      return this.findOne(id);
    } catch (error) {
      //todo:rollback
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
      return product;
  }

  async deleteAll(){
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  private handleDBExceptions(error: any){
    if(error.code == '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error check server logs');
  }
}
