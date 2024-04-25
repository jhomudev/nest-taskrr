import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AddUserInProjectDto } from './dto/add-user-in-project.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLES } from '../common/enums/roles';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  @Get(':userId')
  findById(@Param('userId') id: string) {
    return this.usersService.findById(id);
  }

  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  @Patch(':userId')
  update(@Param('userId') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto, id);
  }

  @ApiBearerAuth()
  @Get(':id/projects')
  getUserProjects(@Param('id') id: string) {
    return this.usersService.getUserProjects(id);
  }

  @ApiBearerAuth()
  @Post('user-projects')
  addUserInProject(@Body() body: AddUserInProjectDto) {
    return this.usersService.addUserInProject(body);
  }
}
