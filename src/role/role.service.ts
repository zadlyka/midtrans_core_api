import { FilterOperator, PaginateQuery, paginate } from 'nestjs-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.roleRepository, {
      sortableColumns: ['id', 'name'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name'],
      filterableColumns: {
        name: [FilterOperator.EQ],
      },
    });
  }

  findOne(id: string) {
    return this.roleRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    this.roleRepository.update(id, {
      ...role,
      ...updateRoleDto,
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    const role = await this.findOne(id);
    this.roleRepository.remove(role);
    return;
  }
}
