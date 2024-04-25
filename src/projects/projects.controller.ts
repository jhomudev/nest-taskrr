import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Request } from 'express';
import { Auth } from '..//auth/decorators/auth.decorator';
import { ActiveUser } from '..//common/decorators/active-user.decorator';
import { ACCESS_LEVEL, ROLES } from '..//common/enums/roles';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @ActiveUser() user: Request['user'],
  ) {
    return this.projectsService.create(createProjectDto, user.sub);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':projectId')
  @Auth({ roles: [ROLES.BASIC], accessLevel: ACCESS_LEVEL.MANTEINER })
  findOne(@Param('projectId') id: string) {
    return this.projectsService.findById(id);
  }

  @Patch(':projectId')
  update(
    @Param('projectId') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':projectId')
  remove(@Param('projectId') id: string) {
    return this.projectsService.remove(id);
  }
}
