import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ACCESS_LEVEL } from '../common/enums/roles';
import { UserProjects } from '../users/entities/userProjects.entity';
import { Equal, Not, Repository, UpdateResult } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(UserProjects)
    private readonly userProjectsRepository: Repository<UserProjects>,
  ) {}
  async validateProjectAlreadyExists({
    data,
    noTakeId,
  }: {
    data: UpdateProjectDto;
    noTakeId?: string;
  }): Promise<UpdateProjectDto> {
    const projectsFound = await this.projectsRepository.find({
      where: noTakeId
        ? {
            id: Not(noTakeId),
            name: Equal(data.name),
          }
        : {
            name: Equal(data.name),
          },
    });
    if (projectsFound.length > 0) {
      throw new ConflictException('Project name already exists');
    }
    return data;
  }

  async create(createProjectDto: CreateProjectDto, creatorUserId: string) {
    const validatedData = await this.validateProjectAlreadyExists({
      data: createProjectDto,
    });
    const newProject = this.projectsRepository.create(validatedData);
    const savedProject = await this.projectsRepository.save(newProject);
    // add creator as project owner
    const accessCreator = await this.userProjectsRepository.create({
      accessLevel: ACCESS_LEVEL.OWNER,
      userId: creatorUserId,
      projectId: savedProject.id,
    });
    await this.userProjectsRepository.save(accessCreator);

    return savedProject;
  }

  findAll(): Promise<Project[]> {
    return this.projectsRepository.find();
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<UpdateResult> {
    const projectFound = await this.findById(id);
    if (!projectFound) {
      throw new NotFoundException('Project not found');
    }
    const validatedData = await this.validateProjectAlreadyExists({
      data: updateProjectDto,
      noTakeId: id,
    });
    return this.projectsRepository.update(id, validatedData);
  }

  async remove(id: string): Promise<UpdateResult> {
    const projectFound = await this.findById(id);
    if (!projectFound) {
      throw new NotFoundException('Project not found');
    }
    return this.projectsRepository.softDelete({ id });
  }
}
