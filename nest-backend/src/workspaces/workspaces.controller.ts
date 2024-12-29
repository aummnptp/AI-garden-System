import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Workspace } from './entities/workspace.entity';
import { User } from 'src/user/entities/user.entity';
import { InviteWorkspaceDto } from './dto/InviteWorkspaceDto';

@Controller('workspaces')
export class WorkspacesController {
  constructor(
    private readonly workspacesService: WorkspacesService
    

  ) {}
  

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

  @Get(':workspaceId')
  findOne(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.findOne(+workspaceId);
  }

  // @Get(':userId')
  // getMyWorkspace(@Param('userId') email: string) {
  //   return this.workspacesService.findOne(+userId);
  // }


  @Patch(':workspaceId')
  update(@Param('workspaceId') workspaceId: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspacesService.update(+workspaceId, updateWorkspaceDto);
  }

  @Delete(':workspaceId')
  remove(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.remove(+workspaceId);
  }
  
  @UseGuards(JwtGuard)
  @Patch(':workspaceId/add-member')
  async addMember(
    @Param('workspaceId') workspaceId: string,
    @Body() body: { email: string; role: string }
  ) {
    return this.workspacesService.addMember(+workspaceId, body.email, body.role || 'member');
  }


  @Delete(':workspaceId/remove-member')
  async removeMember(@Param('workspaceId') workspaceId: string, @Body('email') userEmail: string) {
    // เปลี่ยนuserEmail เป็น role
    return this.workspacesService.removeMember(+workspaceId, userEmail);
  }

  // @Get(':id/members-profiles')
  // async getMembersProfiles(@Param('id') id: string): Promise<User []> {
  //   return this.workspacesService.getMembersProfiles(+id);
  // }
  @Get(':workspaceId/members-profiles')
async getMembersProfiles(@Param('workspaceId') workspaceId: string) {
  return this.workspacesService.getMembersProfiles(+workspaceId);
}



@Post(':workspaceId/invite')
async pendingInvite(
  @Param('workspaceId') workspaceId: number,
  @Body() inviteWorkspaceDto: InviteWorkspaceDto,
) {
  return this.workspacesService.pendingInvite(workspaceId, inviteWorkspaceDto);
}


@Post(':workspaceId/invitations/:invitationId/accept')
  async acceptInvitation(
    @Param('invitationId', ParseIntPipe) invitationId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    return this.workspacesService.acceptInvitation(invitationId, userId);
  }
}
