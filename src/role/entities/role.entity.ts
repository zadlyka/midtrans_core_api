import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from '../enums/permission.enum';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'smallint', array: true, default: [] })
  permissions: Permission[];
}
