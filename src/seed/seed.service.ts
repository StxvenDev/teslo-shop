import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly ProductsService : ProductsService
  ){}

  async runSeed(){
    await this.insertNewProducts();
    return 'Seed execute';
  }

  private async insertNewProducts(){
    await this.ProductsService.deleteAll();
    const products = initialData.products;
    const insertPromises = [];
    // products.forEach(product => {
    //   insertPromises.push(this.ProductsService.create( product ));
    // });

    await Promise.all( insertPromises );

  }
}
