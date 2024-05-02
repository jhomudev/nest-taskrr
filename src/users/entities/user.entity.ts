import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ROLES } from '../../common/enums/roles';
import { IUser } from '../interfaces/user.interface';
import { UserProjects } from './userProjects.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('users')
export class User extends BaseEntity implements IUser {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('int')
  age: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: ROLES, default: ROLES.BASIC })
  role: ROLES;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(() => UserProjects, (userProjects) => userProjects.user)
  projects: UserProjects[];

  @OneToMany(() => Task, (task) => task.responsable)
  tasks: Task[];
}
