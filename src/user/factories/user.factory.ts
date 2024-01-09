import * as bcrypt from 'bcrypt';
import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { User } from '../entities/user.entity';
import { RoleId } from '../../role/enums/role-id.enum';

export default setSeederFactory(User, async (faker: Faker) => {
  const user = new User();
  user.name = faker.person.fullName();
  user.email = faker.internet.email().toLowerCase();
  user.password = await bcrypt.hash('not-set', 10);
  user.roleId = RoleId.User;

  return user;
});
