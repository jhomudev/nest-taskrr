import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const validatedData = await this.validateData(createTaskDto);
    const newTask = this.taskRepository.create(validatedData);
    return await this.taskRepository.save(newTask);
  }

  findAll() {
    return this.taskRepository.find();
  }

  async findById(id: string) {
    const taskFound = await this.taskRepository.findOneBy({ id });
    if (!taskFound) {
      throw new NotFoundException(`Task not found`);
    }
    return taskFound;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const validatedData = await this.validateData(updateTaskDto);
    return await this.taskRepository.update({ id }, validatedData);
  }

  async remove(id: string) {
    const taskFound = await this.findById(id);
    return this.taskRepository.softDelete({ id: taskFound.id });
  }

  async validateUserBelongToProject(userId: string, projectId: string) {
    const userProjects = await this.usersService.getUserProjects(userId);
    const userBelong = userProjects.find(
      (project) => project.projectId === projectId,
    );
    if (!userBelong) {
      throw new ForbiddenException('User does not belong to this project');
    }

    return true;
  }

  async validateData(data: UpdateTaskDto) {
    await this.projectsService.findById(data.projectId);
    if (data.responsableId) {
      await this.usersService.findById(data.responsableId);
      await this.validateUserBelongToProject(
        data.responsableId,
        data.projectId,
      );
    }

    return data;
  }
}
