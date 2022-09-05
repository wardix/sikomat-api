import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Superuser } from './superuser.entity';

@Injectable()
export class SuperusersService {
  constructor(@InjectRepository(Superuser) private readonly superuserRepository: Repository<Superuser>) { }

  async findAll(): Promise<Superuser[]> {
    return this.superuserRepository.find();
  }

  async findOne(username: string): Promise<Superuser> {
    return this.superuserRepository.findOneBy({ username: username });
  }
}
