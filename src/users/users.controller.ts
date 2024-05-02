import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { ROLES } from '../common/enums/roles';
import { AddUserInProjectDto } from './dto/add-user-in-project.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Auth({ roles: [ROLES.ADMIN] })
  @Get(':userId')
  findById(@Param('userId') id: string) {
    return this.usersService.findById(id);
  }

  @Auth({ roles: [ROLES.ADMIN] })
  @Patch(':userId')
  update(@Param('userId') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto, id);
  }

  @Get(':id/projects')
  getUserProjects(@Param('id') id: string) {
    return this.usersService.getUserProjects(id);
  }

  @Post('user-projects')
  addUserInProject(@Body() body: AddUserInProjectDto) {
    return this.usersService.addUserInProject(body);
  }
}
