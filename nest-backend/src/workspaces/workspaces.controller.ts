import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, NotFoundException, Req, Query, Res, BadRequestException } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Workspace } from './entities/workspace.entity';
import { User } from 'src/user/entities/user.entity';
import { InviteWorkspaceDto } from './dto/InviteWorkspaceDto';


import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorator/roles-decoraters';

import { WorkspaceRole } from 'src/auth/decorator/workspaceRole-decorater';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { ChangeRoleDto } from './dto/change-role.dto';
import { Response } from 'express';
import { WorkspaceRoleGuard } from 'src/auth/guards/workspace-role.guard';

@Controller('workspaces')
export class WorkspacesController {
  constructor(
    private readonly workspacesService: WorkspacesService
  ) { }


  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  @Post('create')
  async create(@Request() req, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    const userId = req.user.userId;
    // return  req.user
    return this.workspacesService.create(createWorkspaceDto, userId);
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  findAll() {
    return this.workspacesService.findAll();
  }

  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/detail/:workspaceId')
  findOne(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.findOne(workspaceId);
  }

  @Role("user")
  @WorkspaceRole('owner')
  @UseGuards(JwtGuard, RolesGuard, WorkspaceRoleGuard)
  @Patch('/update/:workspaceId')
  update(@Param('workspaceId') workspaceId: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspacesService.update(workspaceId, updateWorkspaceDto);
  }

  @Role("user")
  @WorkspaceRole('owner')
  @UseGuards(JwtGuard, RolesGuard, WorkspaceRoleGuard)
  @Delete('/delete/:workspaceId')
  remove(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.remove(workspaceId);
  }

  @Role("user")
  @WorkspaceRole('owner')
  @UseGuards(JwtGuard, RolesGuard, WorkspaceRoleGuard)
  @Get('/members-profiles/:workspaceId')
  async getMembersProfiles(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.getMembersProfiles(workspaceId);
  }

  @Role("user")
  @WorkspaceRole('owner')
  @UseGuards(JwtGuard, RolesGuard, WorkspaceRoleGuard)
  @Patch('/add-member/:workspaceId')
  async addMember(
    @Param('workspaceId') workspaceId: string,
    @Body() body: { email: string; role: string }
  ) {
    return this.workspacesService.addMember(workspaceId, body.email, body.role || 'member');
  }

  @Role("user")
  @WorkspaceRole('owner')
  @UseGuards(JwtGuard, RolesGuard, WorkspaceRoleGuard)
  @Delete('/remove-member/:workspaceId')
  async removeMember(
    @Param('workspaceId') workspaceId: string,
    @Body('userId') userId: string) {
    // เปลี่ยนuserEmail เป็น role
    return this.workspacesService.removeMember(workspaceId, userId);
  }

  @Role("user")
  @WorkspaceRole('owner')
  @UseGuards(JwtGuard, RolesGuard, WorkspaceRoleGuard)
  @Get('/available-users/:workspaceId')
  async getUserListInvitation(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.getNonMembersProfiles(workspaceId);
  }

  // รายชื่อที่ชวนไป
  @Role("user")
  @WorkspaceRole('owner')
  @UseGuards(JwtGuard, RolesGuard, WorkspaceRoleGuard)
  // @UseGuards(JwtGuard)
  @Post('/pending-invite/:workspaceId')
  async pendingInvite(@Request() req, @Param('workspaceId') workspaceId: string, @Body() inviteWorkspaceDto: InviteWorkspaceDto,) {
    const userId = req.user.userId;
    const results = await Promise.all(inviteWorkspaceDto.emails.map(async (email) => {
      try {
        return await this.workspacesService.pendingInvite(workspaceId, userId, email);
      } catch (error) {
        return { email, error: error.message }
      }
    }),
    );
    return results;
  }

  @Role("user")
  @WorkspaceRole('owner')
  @UseGuards(JwtGuard, RolesGuard, WorkspaceRoleGuard)
  @Delete('/cancel-invite/:workspaceId')
  async cancelPendingInvite(
    @Request() req,
    @Param('workspaceId') workspaceId: string,
    @Body() body: { inviteId: string }
  ) {
    return this.workspacesService.cancelPendingInvite(body.inviteId);
  }

  @Role("user")
  @WorkspaceRole('owner')
  @UseGuards(JwtGuard, RolesGuard, WorkspaceRoleGuard)
  // @UseGuards(JwtGuard)
  @Get('/pending-users/:workspaceId')
  async getPendingUserList(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.getPendingUserList(workspaceId);
  }

  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/accept-invite/:invitationId')
  async acceptInvitation(
    @Request() req,
    @Param('invitationId') invitationId: string,
  ): Promise<WorkspaceMember> {
    const userId = req.user.userId;
    return this.workspacesService.acceptInvitation(invitationId, userId);
  }

  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/reject-invite/:invitationId')
  async rejectInvitation(
    @Request() req,
    @Param('invitationId') invitationId: string,
  ): Promise<void> {
    const userId = req.user.userId;
    return this.workspacesService.rejectInvitation(invitationId, userId);
  }

  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/my-workspaces')
  async getAllWorkspacesWithMembers(@Request() req,) {
    const userId = req.user.userId;
    return this.workspacesService.getAllWorkspaceWithMembers(userId);
  }

  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/invite-workspaces')
  async getInvitedWorkspacesWithMembers(@Request() req,) {
    const userId = req.user.userId;
    return this.workspacesService.getWorkspacesWhereUserIsMember(userId);
  }

  @Role("user")
  @WorkspaceRole('owner')
  @UseGuards(JwtGuard, RolesGuard, WorkspaceRoleGuard)
  @Patch('/change-role/:workspaceId')
  async changeRole(
    @Param('workspaceId') workspaceId: string,
    @Body() changeRoleDto: ChangeRoleDto
  ): Promise<WorkspaceMember> {
    return this.workspacesService.changeUserRole(
      workspaceId,
      changeRoleDto.memberId,
      changeRoleDto.role
    );
  }

  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/get-my-invitation')
  async showmyInvitation(@Request() req,) {
    const userId = req.user.userId;
    return this.workspacesService.getMyInvitation(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':workspaceId/my-role')
  async getWorkspaceRole(@Param('workspaceId') workspaceId: string, @Req() req): Promise<{ role: string }> {
    const userId = req.user.userId;
    const member = await this.workspacesService.getWorkspaceMember(workspaceId, userId);
    if (!member) {
      throw new NotFoundException('User is not a member of this workspace');
    }
    return { role: member.role };
  }


  @UseGuards(JwtGuard)
  @Get('/generate-invite/:workspaceId')
  async generateInvite(@Param('workspaceId') workspaceId: string, @Req() req) {
    return this.workspacesService.generateInviteLink(workspaceId,);
  }

  @Get('/validate-invite')
  async validateInvite(@Query('token') token: string) {
    return this.workspacesService.validateInviteToken(token);
  }

  @UseGuards(JwtGuard)
  @Post('/join-workspace')
  async joinWorkspace(@Body() { token }: { token: string }, @Req() req) {
    const userId = req.user.userId;
    return this.workspacesService.joinWorkspaceWithToken(token, userId);
  }

  @Get('invite')
  async redirectToFrontend(@Query("token") token: string, @Res() res: Response) {
    if (!token) {
      throw new BadRequestException("Token is required");
    }
    // Redirect ผู้ใช้ไปยัง Frontend
    const frontendUrl = `${process.env.REACT_APP_API_URL}/invite?token=${token}`;
    return res.redirect(frontendUrl);
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Get('personal/:userId')
  findWithUserId(@Param('userId') userId: string) {
    return this.workspacesService.getWorkspaceWithMembersByUserId(userId);
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Get('count/:userId')
  async getUserWorkspaceCount(@Param('userId') userId: string) {
    const count = await this.workspacesService.countUserWorkspaces(userId);
    return { userId, workspaceCount: count };
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/all')
async getAllWorkspaces(): Promise<Workspace[]> {
    return this.workspacesService.getAllWorkspacesInSystem();
}

}
