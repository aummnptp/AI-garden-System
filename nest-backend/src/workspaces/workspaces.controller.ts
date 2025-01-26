import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, NotFoundException, Req } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Workspace } from './entities/workspace.entity';
import { User } from 'src/user/entities/user.entity';
import { InviteWorkspaceDto } from './dto/InviteWorkspaceDto';


import { RolesGuard } from 'src/auth/guards/role.guard';

import { WorkspaceRoleGuard } from 'src/auth/guards/workspace-role.guard';
import { Role } from 'src/auth/decorator/roles-decoraters';
import { WorkspaceRole } from 'src/auth/decorator/workspaceRole-decorater';


@Controller('workspaces')
export class WorkspacesController {
  constructor(
    private readonly workspacesService: WorkspacesService
    

  ) {}
  

  @Role("user")
  @UseGuards(JwtGuard,RolesGuard)
  @Post('create')
  async create(@Request() req,@Body() createWorkspaceDto: CreateWorkspaceDto) {
    const userId = req.user.userId; 
    // return  req.user
    return this.workspacesService.create(createWorkspaceDto, userId);
  }

  @Role("admin")
  @UseGuards(JwtGuard,RolesGuard)
  @Get()
  findAll() {
    return this.workspacesService.findAll();
  }

  @Role("user")
  @UseGuards(JwtGuard,RolesGuard)
  @Get('/detail/:workspaceId')
  findOne(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.findOne(+workspaceId);
  }


  @Role("user")
  @WorkspaceRole('owner') 
  @UseGuards(JwtGuard,RolesGuard,WorkspaceRoleGuard)
  @Patch('/update/:workspaceId')
  update(@Param('workspaceId') workspaceId: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspacesService.update(+workspaceId, updateWorkspaceDto);
  }

  @Role("user")
  @WorkspaceRole('owner') 
  @UseGuards(JwtGuard,RolesGuard,WorkspaceRoleGuard)
  @Delete('/delete/:workspaceId')
  remove(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.remove(+workspaceId);
  }
  
  @Role("user")
  @WorkspaceRole('owner') 
  @UseGuards(JwtGuard,RolesGuard,WorkspaceRoleGuard)
  @Patch('/add-member/:workspaceId')
  async addMember(
    @Param('workspaceId') workspaceId: string,
    @Body() body: { email: string; role: string }
  ) {
    return this.workspacesService.addMember(+workspaceId, body.email, body.role || 'member');
  }

  @Role("user")
  @WorkspaceRole('owner') 
  @UseGuards(JwtGuard,RolesGuard,WorkspaceRoleGuard)
  @Delete('/remove-member/:workspaceId')
  async removeMember(
    @Param('workspaceId') workspaceId: string, 
    @Body('userId') userId: number) {
    // เปลี่ยนuserEmail เป็น role
    return this.workspacesService.removeMember(+workspaceId, userId);
  }

  @Role("user")
  @WorkspaceRole('owner') 
  @UseGuards(JwtGuard,RolesGuard,WorkspaceRoleGuard)
  @Get('/members-profiles/:workspaceId')
  async getMembersProfiles(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.getMembersProfiles(+workspaceId);
  }

  @Role("user")
  @WorkspaceRole('owner') 
  @UseGuards(JwtGuard,RolesGuard,WorkspaceRoleGuard)
  @Get('/available-users/:workspaceId')
  async getUserListInvitation(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.getNonMembersProfiles(+workspaceId);
  }



// async create(@Request() req,@Body() createWorkspaceDto: CreateWorkspaceDto) {
//   const userId = req.user.userId; 
//   // return  req.user
//   return this.workspacesService.create(createWorkspaceDto, userId);
// }

// รายชื่อที่ชวนไป
@Role("user")
@WorkspaceRole('owner') 
@UseGuards(JwtGuard,RolesGuard,WorkspaceRoleGuard)
// @UseGuards(JwtGuard)
@Post('/pending-invite/:workspaceId')
async pendingInvite(@Request() req,@Param('workspaceId') workspaceId: number, @Body() inviteWorkspaceDto: InviteWorkspaceDto,) {
  const userId = req.user.userId; 
  const results = await Promise.all( inviteWorkspaceDto.emails.map(async (email) => {
    try{
      return await this.workspacesService.pendingInvite(workspaceId, userId ,email);
    }catch (error){
      return {email, error: error.message}
    }
  }),
);
  return results ;
}

// เพิ่มเช็คrole ในการcancel
@Role("user")
@WorkspaceRole('owner') 
@UseGuards(JwtGuard,RolesGuard,WorkspaceRoleGuard)
@Delete('/cancel-invite/:inviteId')
async cancelPendingInvite(
  @Request() req,
  @Param('inviteId') inviteId: number,  // รับ inviteId จาก URL

) {

  return this.workspacesService.cancelPendingInvite( inviteId);
}

@Role("user")
@WorkspaceRole('owner') 
@UseGuards(JwtGuard,RolesGuard,WorkspaceRoleGuard)
// @UseGuards(JwtGuard)
@Get('/pending-users/:workspaceId')
async getPendingUserList(@Param('workspaceId') workspaceId: string) {
  return this.workspacesService.getPendingUserList(+workspaceId);
}



@Role("user")
@UseGuards(JwtGuard,RolesGuard)
@Post('/accept-invite/:invitationId')
  async acceptInvitation(
    @Request() req,
    @Param('invitationId', ParseIntPipe) invitationId: number,
  ) {
    const userId = req.user.userId; 
    return this.workspacesService.acceptInvitation(invitationId,userId);
  }



  
  // Endpoint สำหรับดึง Workspace พร้อมกับข้อมูลสมาชิกทั้งหมด (workspaceMember entity) มีตาราง invite
  // @Get(':workspaceId/with-members')
  // async getWorkspaceWithMembers(@Param('id') workspaceId: number) {
    //   return this.workspacesService.getWorkspaceWithMembers(workspaceId);
    // }
    
    // Endpoint สำหรับดึงสมาชิกทั้งหมดใน Workspace (workspaceMember entity)
    // @Get(':workspaceId/members')
    // async getAllMembersInWorkspace(@Param('id') workspaceId: number) {
    //     return this.workspacesService.getAllMembersInWorkspace(workspaceId);
    //   }

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
  @UseGuards(JwtGuard,RolesGuard,WorkspaceRoleGuard)
  @Patch('/change-role/:workspaceId')
  async changeRole(
    @Request() req,   @Param('workspaceId') workspaceId: number,   
    @Body() body: { userId: number; role: 'owner' | 'member' } 
  ){
    const currentUserId = req.user.userId; // ดึงข้อมูล `userId` ของผู้ที่ส่งคำขอ
    return this.workspacesService.changeUserRole(workspaceId, currentUserId, body.userId, body.role);
    
  }


@Role("user")
@UseGuards(JwtGuard,RolesGuard)
@Get('/get-my-invitation')
async showmyInvitation(@Request() req, ) {
  const userId = req.user.userId;
  return this.workspacesService.getMyInvitation(userId);
}

@UseGuards(JwtGuard)
@Get(':workspaceId/my-role')
async getWorkspaceRole(@Param('workspaceId') workspaceId: number, @Req() req): Promise<{ role: string }> {
  const userId = req.user.userId; // ดึง userId จาก JWT Payload

  const member = await this.workspacesService.getWorkspaceMember(workspaceId, userId);

  if (!member) {
    throw new NotFoundException('User is not a member of this workspace');
  }

  return { role: member.role };
}

@Role("admin")
@UseGuards(JwtGuard, RolesGuard)
@Get(':userId')
findWithUserId(@Param('userId') userId: number) {
  return this.workspacesService.getWorkspaceWithMembersByUserId(userId);
  }

}
