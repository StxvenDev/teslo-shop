import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {validate as isUUID} from 'uuid';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      const {images = [], ...productDetails} = createProductDto;
      const product = this.productRepository.create({
        ...createProductDto,
        images: images.map( image => this.productImageRepository.create({url:image}))
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
        skip: offset
      });
      return products;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    try {

      let product : Product;
      if(isUUID(term)){
        product = await this.productRepository.findOneBy({id:term});
      }else{
        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder.where('title ILIKE :title or slug =:slug',{
          title: term,
          slug: term
        }).getOne();
      }
      // const product = await this.productRepository.findOneBy({id});
      if( !product )
        throw new NotFoundException(`product with ${term} not found`)
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.preload({
        id,
        ...updateProductDto,
        images: []
      })
      if(!product) throw new NotFoundException();
      return this.productRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any){
    if(error.code == '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error check server logs');
  }
}
