import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Workspace } from './entities/workspace.entity';
import { User } from 'src/user/entities/user.entity';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @UseGuards(JwtGuard)
  @Post('create')
  async create(@Request() req,@Body() createWorkspaceDto: CreateWorkspaceDto) {
    const userEmail = req.user.email; 
    return this.workspacesService.create(createWorkspaceDto, userEmail);
  }

  @Get()
  findAll() {
    return this.workspacesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspacesService.findOne(+id);
  }

  // @Get(':userId')
  // getMyWorkspace(@Param('userId') email: string) {
  //   return this.workspacesService.findOne(+userId);
  // }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspacesService.update(+id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspacesService.remove(+id);
  }
  
  @Patch(':id/add-member')
  async addMember(@Param('id') id: string, @Body('email') userEmail: string) {
    return this.workspacesService.addMember(+id, userEmail);
  }
  @Delete(':id/remove-member')
  async removeMember(@Param('id') id: string, @Body('email') userEmail: string) {
    // เปลี่ยนuserEmail เป็น role
    return this.workspacesService.removeMember(+id, userEmail);
  }

  @Get(':id/members-profiles')
  async getMembersProfiles(@Param('id') id: string): Promise<User []> {
    return this.workspacesService.getMembersProfiles(+id);
  }
}
