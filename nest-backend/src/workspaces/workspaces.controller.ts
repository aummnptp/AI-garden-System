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
    const userId = req.user.userId; 
    // return  req.user
    return this.workspacesService.create(createWorkspaceDto, userId);
  }

  @Get()
  findAll() {
    return this.workspacesService.findAll();
  }

  @Get('/detail/:workspaceId')
  findOne(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.findOne(+workspaceId);
  }

  // @Get(':userId')
  // getMyWorkspace(@Param('userId') email: string) {
  //   return this.workspacesService.findOne(+userId);
  // }


  @Patch('/update/:workspaceId')
  update(@Param('workspaceId') workspaceId: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspacesService.update(+workspaceId, updateWorkspaceDto);
  }

  @Delete('/delete/:workspaceId')
  remove(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.remove(+workspaceId);
  }
  
  @UseGuards(JwtGuard)
  @Patch('/add-member/:workspaceId')
  async addMember(
    @Param('workspaceId') workspaceId: string,
    @Body() body: { email: string; role: string }
  ) {
    return this.workspacesService.addMember(+workspaceId, body.email, body.role || 'member');
  }


  @Delete('/remove-member/:workspaceId')
  async removeMember(
    @Param('workspaceId') workspaceId: string, 
    @Body('userId') userId: number) {
    // เปลี่ยนuserEmail เป็น role
    return this.workspacesService.removeMember(+workspaceId, userId);
  }


  @Get('/members-profiles/:workspaceId')
  async getMembersProfiles(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.getMembersProfiles(+workspaceId);
  }


@Get('/available-users/:workspaceId')
async getUserListInvitation(@Param('workspaceId') workspaceId: string) {
  return this.workspacesService.getNonMembersProfiles(+workspaceId);
}



// async create(@Request() req,@Body() createWorkspaceDto: CreateWorkspaceDto) {
//   const userId = req.user.userId; 
//   // return  req.user
//   return this.workspacesService.create(createWorkspaceDto, userId);
// }

@UseGuards(JwtGuard)
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
// เพิ่มเช็คrole ในการเcancel
@UseGuards(JwtGuard)
@Delete('/cancel-invite/:inviteId')
async cancelPendingInvite(
  @Request() req,
  @Param('inviteId') inviteId: number,  // รับ inviteId จาก URL

) {

  return this.workspacesService.cancelPendingInvite( inviteId);
}

@Get('/pending-users/:workspaceId')
async getPendingUserList(@Param('workspaceId') workspaceId: string) {
  return this.workspacesService.getPendingUserList(+workspaceId);
}


@UseGuards(JwtGuard)
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
      
      @UseGuards(JwtGuard)
      @Get('/my-workspaces')
      async getAllWorkspacesWithMembers(@Request() req,) {
        const userId = req.user.userId; 
        return this.workspacesService.getAllWorkspaceWithMembers(userId);
      }

  
  @UseGuards(JwtGuard)
  @Get('/invite-workspaces')
  async getInvitedWorkspacesWithMembers(@Request() req,) {
    const userId = req.user.userId; 
    return this.workspacesService.getWorkspacesWhereUserIsMember(userId);
  }


  @UseGuards(JwtGuard)
  @Patch('/change-role/:workspaceId')
  async changeRole(
    @Request() req,   @Param('workspaceId') workspaceId: number,   
    @Body() body: { userId: number; role: 'owner' | 'member' } 
  ){
    const currentUserId = req.user.userId; // ดึงข้อมูล `userId` ของผู้ที่ส่งคำขอ
    return this.workspacesService.changeUserRole(workspaceId, currentUserId, body.userId, body.role);
    return
  }


 @UseGuards(JwtGuard)
@Get('/get-my-invitation')
async showmyInvitation(@Request() req, ) {
  const userId = req.user.userId;
  return this.workspacesService.getMyInvitation(userId);
}

}
