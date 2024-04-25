import { BaseEntity } from '../../common/entities/base.entity';
import { STATUS_TASK } from '../enums/status-task';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('tasks')
export class Task extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: STATUS_TASK, default: STATUS_TASK.PENDING })
  status: STATUS_TASK;

  @Column()
  projectId: string;

  @Column({ nullable: true })
  responsableId: string;

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn()
  project: Project;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn()
  responsable: User;
}
