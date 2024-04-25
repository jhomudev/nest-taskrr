import { BaseEntity } from '../../common/entities/base.entity';
import { ACCESS_LEVEL } from '../../common/enums/roles';
import { Project } from '../../projects/entities/project.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('users_projects')
@Index(['userId', 'projectId'], { unique: true })
export class UserProjects extends BaseEntity {
  @Column({ type: 'enum', enum: ACCESS_LEVEL, default: ACCESS_LEVEL.OWNER })
  accessLevel: ACCESS_LEVEL;

  @Column()
  userId: string;

  @Column()
  projectId: string;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Project, (project) => project.users)
  @JoinColumn()
  project: Project;
}
