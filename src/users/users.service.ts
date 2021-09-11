import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  async findOne(id: number) {
    if (!id) {
      return;
    }

    const user = await this.repo.findOne(id);

    return user;
  }

  find(email: string) {
    if (email) {
      return this.repo.find({ email });
    }

    return this.repo.find();
  }

  private async findOrError(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOrError(id);
    const updatedUser = { ...user, ...attrs };

    return this.repo.save(updatedUser);
  }

  async remove(id: number) {
    const user = await this.findOrError(id);

    return this.repo.remove(user);
  }
}
