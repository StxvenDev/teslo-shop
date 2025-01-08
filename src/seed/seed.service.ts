import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly ProductsService : ProductsService,

    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ){}

  async runSeed(){
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts( adminUser );
    return 'Seed execute';
  }

  private async deleteTables(){
    await this.ProductsService.deleteAll();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
        .delete()
        .where({})
        .execute()
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach( user => {
      user.password = bcrypt.hashSync( user.password, 10 )
      users.push(this.userRepository.create(user))
    });
    await this.userRepository.save(users);
    return users[0];
  }

  private async insertNewProducts( user: User ){
    await this.ProductsService.deleteAll();
    const products = initialData.products;
    const insertPromises = [];
    products.forEach(product => {
      insertPromises.push(this.ProductsService.create( product, user ));
    });

    await Promise.all( insertPromises );
  }


}
