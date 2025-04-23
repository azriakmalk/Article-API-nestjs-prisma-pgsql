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
    try {
      const userData = await this.prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          created_at: true,
          updated_at: true,
        },
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!userData) throw new BadRequestException('User not found!');

      return userData;
    } catch (error) {
      throwError(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const userData = await this.prisma.user.findUnique({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!userData) throw new BadRequestException('User not found!');

      const { email, name, password, username } = updateUserDto;
      const hashPassword = await bcrypt.hash(password, 10);

      const updateUser = await this.prisma.user.update({
        data: {
          email,
          name,
          username,
          password: hashPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          created_at: true,
          updated_at: true,
        },
        where: {
          id: userData.id,
          deleted_at: null,
        },
      });

      return updateUser;
    } catch (error) {
      throwError(error);
    }
  }

  async remove(id: number) {
    try {
      const userData = await this.prisma.user.findUnique({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!userData) throw new BadRequestException('User not found!');

      await this.prisma.user.update({
        data: {
          deleted_at: new Date(),
        },
        where: { id },
      });

      return {
        name: userData.name,
        username: userData.username,
        email: userData.email,
      };
    } catch (error) {
      throwError(error);
    }
  }

  async findByUsernameOrEmail(data: string) {
    try {
      const userData = await this.prisma.user.findFirst({
        where: {
          OR: [
            {
              username: {
                equals: data,
              },
            },
            {
              email: {
                equals: data,
              },
            },
          ],
        },
      });

      return userData;
    } catch (error) {
      throwError(error);
    }
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
