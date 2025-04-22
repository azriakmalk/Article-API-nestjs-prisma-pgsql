import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { throwError } from 'src/common/utils/throw-error.util';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { email, name, password, username } = createUserDto;

      await this.validateUser(createUserDto);

      const hashPassword = await bcrypt.hash(password, 10);
      const addUser = await this.prisma.user.create({
        data: { email, name, username, password: hashPassword },
      });

      return { id: addUser.id, name, username, email };
    } catch (error) {
      throwError(error);
    }
  }

  async findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async validateUser(dataUser) {
    const { email, username } = dataUser;
    const existingEmail = await this.prisma.user.findFirst({
      where: { email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const existingUsername = await this.prisma.user.findFirst({
      where: { username },
    });
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }
  }
}
