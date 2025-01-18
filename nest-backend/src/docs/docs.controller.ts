import { Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DocsService } from './docs.service';
import { CreateDocsDto } from './dto/create-document.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorator/roles-decoraters';



@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Get('/')
  async getDocsTitle() {
    return this.docsService.findAll();
  }


  @Role("admin")
  @UseGuards(JwtGuard,RolesGuard)
  @Post('/create-docs')
  async createDocsTitle(createDocsDto: CreateDocsDto) {
    return this.docsService.create(createDocsDto);
  }
  
  @Role("admin")
  @UseGuards(JwtGuard,RolesGuard)
  @Patch("/update-docs/docsId")
  async updateDocs() {
    return this.docsService.findAll();
  }
  @Role("admin")
  @UseGuards(JwtGuard,RolesGuard)
  @Delete("/delete-docs/docsId")
  async deleteDocs(@Param('docsId') docsId:string) {
    return this.docsService.delete(+docsId);
  }

  

  @Get('/detail-docs/:docsId')
  async getDocsConetent() {

    // return this.workspacesService.getAllWorkspaceWithMembers(userId);
  }
  
  
  
    @Get('/:subDocsId/detail')
    async getSubDocsConetent() {
      
      // return this.workspacesService.getAllWorkspaceWithMembers(userId);
    }
    
    @Patch("update-subDocs/docsId")
    async updateSubDocs() {
      // return this.workspacesService.getAllWorkspaceWithMembers(userId);
    }
    @Delete("/update-subDocs/docsId")
    async deleteSubDocs() {
      // return this.workspacesService.getAllWorkspaceWithMembers(userId);
    }
    


}
