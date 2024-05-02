import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository, UpdateResult } from 'typeorm';
import { ProjectsService } from '../projects/projects.service';
import { AddUserInProjectDto } from './dto/add-user-in-project.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserProjects } from './entities/userProjects.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserProjects)
    private readonly userProjectsRepository: Repository<UserProjects>,
    private readonly projectsService: ProjectsService,
  ) {}

  async validateDataConfilicts({
    data,
    noTakeId,
  }: {
    data: UpdateUserDto;
    noTakeId?: string;
  }): Promise<UpdateUserDto> {
    const usersFound = await this.usersRepository.find({
      where: noTakeId
        ? [
            {
              id: Not(noTakeId),
              email: Equal(data.email),
            },
            {
              id: Not(noTakeId),
              username: Equal(data.username),
            },
          ]
        : [{ email: Equal(data.email) }, { username: Equal(data.username) }],
    });

    if (usersFound.length > 0) {
      throw new BadRequestException('User or user data already in use');
    }
    return data;
  }

  async create(data: CreateUserDto): Promise<User> {
    const validatedData = await this.validateDataConfilicts({ data });
    const userCreated = this.usersRepository.create(validatedData);
    return this.usersRepository.save(userCreated);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const userFound = await this.usersRepository.findOne({
      where: { id },
      relations: ['projects', 'projects.project'],
    });

    if (!userFound) {
      throw new NotFoundException('User not found');
    }
    return userFound;
  }

  async findByIdWithRefreshTooken(id: string): Promise<User> {
    const userFound = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'role',
        'firstName',
        'lastName',
        'refreshToken',
        'role',
      ],
    });

    if (!userFound) {
      throw new NotFoundException('User not found');
    }
    return userFound;
  }

  async findByEmail(email: string): Promise<User> {
    const userFound = await this.usersRepository.findOneBy({ email });
    if (!userFound) {
      throw new NotFoundException('User not found');
    }
    return userFound;
  }

  async findByEmailWithPassword(emailOrUsername: string): Promise<User> {
    const userFound = await this.usersRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
      select: [
        'id',
        'username',
        'email',
        'password',
        'role',
        'firstName',
        'lastName',
      ],
    });
    if (!userFound) {
      throw new NotFoundException('User not found');
    }
    return userFound;
  }

  async update(data: UpdateUserDto, id: string): Promise<UpdateResult> {
    const validatedData = await this.validateDataConfilicts({
      data,
      noTakeId: id,
    });
    const res = await this.usersRepository.update({ id }, validatedData);
    if (res.affected === 0) {
      throw new InternalServerErrorException('User not updated');
    }
    return res;
  }

  async delete(id: string): Promise<UpdateResult> {
    const userFound = await this.findById(id);
    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    const res = await this.usersRepository.softDelete({ id });
    return res;
  }

  // Ralations Entity UserProjects
  async addUserInProject({ accessLevel, ...data }: AddUserInProjectDto) {
    const validatedData = await this.validateUserInProjectExists(data);
    const userProject = this.userProjectsRepository.create({
      ...validatedData,
      accessLevel,
    });
    return this.userProjectsRepository.save(userProject);
  }

  async getAllRelations() {
    return this.userProjectsRepository.find();
  }

  async getUserProjects(userId: string) {
    return this.userProjectsRepository.find({
      where: { userId },
    });
  }

  async validateUserInProjectExists({
    projectId,
    userId,
  }: Omit<AddUserInProjectDto, 'accessLevel'>) {
    const userFound = await this.findById(userId);
    const projectFound = await this.projectsService.findById(projectId);
    const userProject = await this.userProjectsRepository.findOneBy({
      projectId: projectFound.id,
      userId: userFound.id,
    });
    if (userProject) {
      throw new BadRequestException('User is already in this project');
    }
    return { projectId, userId };
  }
}
