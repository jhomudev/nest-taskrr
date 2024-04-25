import { BaseEntity } from '../../common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IProject } from '../interfaces/project.interface';
import { UserProjects } from '../../users/entities/userProjects.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('projects')
export class Project extends BaseEntity implements IProject {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => UserProjects, (project) => project.project)
  users: UserProjects[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
