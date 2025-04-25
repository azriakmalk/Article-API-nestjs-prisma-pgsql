import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { throwError } from 'src/common';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createArticleDto: CreateArticleDto) {
    try {
      return 'This action adds a new article';
    } catch (error) {
      throwError(error);
    }
  }

  async findAll() {
    try {
      return;
    } catch (error) {
      throwError(error);
    }
  }

  async findOne(id: number) {
    try {
      return;
    } catch (error) {
      throwError(error);
    }
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    try {
      return;
    } catch (error) {
      throwError(error);
    }
  }

  async remove(id: number) {
    try {
      return;
    } catch (error) {
      throwError(error);
    }
  }
}
