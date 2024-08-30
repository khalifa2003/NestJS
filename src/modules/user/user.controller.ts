import {
  Controller,
  Get,
  Post,
  Delete,
  HttpCode,
  Param,
  Body,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  @Get('me')
  async getLoggedUserData(@Req() req): Promise<User> {
    return this.userService.findOne(req.user._id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  @Put('me/password')
  @HttpCode(204) // No Content, as we're not returning a response body
  async updateLoggedUserPassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.userService.updatePassword(req.user._id, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  @Put('me')
  async updateLoggedUserData(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.userService.updateLoggedUser(req.user._id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin, Role.Manager)
  @Delete('me')
  @HttpCode(204) // No Content
  async deleteLoggedUserData(@Req() req): Promise<void> {
    await this.userService.deactivateUser(req.user._id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  @Delete(':id')
  @HttpCode(204) // No Content
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id/role') // More RESTful route
  // @HttpCode(204) // No Content
  async updateToManager(@Param('id') id: string): Promise<User> {
    return await this.userService.updateRole(id);
  }
}
