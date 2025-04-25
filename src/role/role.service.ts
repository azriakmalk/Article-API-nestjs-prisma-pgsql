import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PaginationDto,
  SearchAndSortDto,
  SortSearchColumn,
  throwError,
} from 'src/common';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}
  async create(req: Request, createRoleDto: CreateRoleDto) {
    try {
      const { name } = createRoleDto;
      const roleData = await this.prisma.role.findFirst({
        where: {
          name: { contains: name, mode: 'insensitive' },
          deleted_at: null,
        },
      });
      if (roleData) throw new BadRequestException('Role already exists!');

      const addRole = await this.prisma.role.create({
        data: { name },
        select: {
          id: true,
          name: true,
          created_at: true,
        },
      });

      return addRole;
    } catch (error) {
      throwError(error);
    }
  }

  async findAll(
    req: Request,
    paginationData: PaginationDto,
    searchandsortData: SearchAndSortDto,
  ) {
    try {
      const limit = +paginationData.limit || 100;
      const page = +paginationData.page || 1;

      const { sort_column, sort_desc, search_column, search_text, search } =
        searchandsortData;

      const columnMapping: {
        [key: string]: { field: string; type: 'string' };
      } = {
        name: { field: 'name', type: 'string' },
      };

      const { orderBy, where } = SortSearchColumn(
        sort_column,
        sort_desc,
        search_column,
        search_text,
        search,
        columnMapping,
        true,
      );

      const [totalData, data] = await this.prisma.$transaction([
        this.prisma.role.count({
          where: where,
        }),
        this.prisma.role.findMany({
          select: {
            id: true,
            name: true,
            created_at: true,
          },
          take: limit,
          skip: limit * (page - 1),
          orderBy: orderBy,
          where: where,
        }),
      ]);

      const totalPage = Math.ceil(totalData / limit);

      return { data, page, totalPage, totalData };
    } catch (error) {
      throwError(error);
    }
  }

  async findOne(req: Request, id: number) {
    try {
      const roleData = await this.prisma.role.findUnique({
        select: {
          id: true,
          name: true,
          created_at: true,
          updated_at: true,
        },
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!roleData) throw new BadRequestException('Role not found!');

      return roleData;
    } catch (error) {
      throwError(error);
    }
  }

  async update(req: Request, id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const roleData = await this.prisma.role.findUnique({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!roleData) throw new BadRequestException('Role not found!');

      const { name } = updateRoleDto;

      const updateRole = await this.prisma.role.update({
        data: {
          name,
        },
        select: {
          id: true,
          name: true,
          created_at: true,
          updated_at: true,
        },
        where: {
          id: roleData.id,
          deleted_at: null,
        },
      });

      return updateRole;
    } catch (error) {
      throwError(error);
    }
  }

  async remove(req: Request, id: number) {
    try {
      const roleData = await this.prisma.role.findUnique({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!roleData) throw new BadRequestException('Role not found!');

      const roleUpdated = await this.prisma.role.update({
        data: {
          deleted_at: new Date(),
        },
        select: {
          id: true,
          name: true,
          created_at: true,
        },
        where: { id },
      });

      return roleUpdated;
    } catch (error) {
      throwError(error);
    }
  }
}
