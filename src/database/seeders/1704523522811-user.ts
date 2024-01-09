import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { RoleId } from '../../role/enums/role-id.enum';
import { User } from '../../user/entities/user.entity';

export class User1704523522811 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    await userRepository.save({
      email: 'admin@mail.com',
      name: 'admin',
      password: await bcrypt.hash('not-set', 10),
      roleId: RoleId.Admin,
    });
    await factoryManager.get(User).saveMany(5);
  }
}
