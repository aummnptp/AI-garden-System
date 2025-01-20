import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { DocsService } from './docs.service';
import { CreateDocsDto, CreateSubDocsDto } from './dto/create-document.dto';
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
  @Post('/add-title')
  async createDocsTitle(@Request() req,@Body() createDocsDto: CreateDocsDto) {
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
  @Delete("/delete-docs/:docsId")
  async deleteDocs(@Param('docsId') docsId:string) {
    return this.docsService.delete(+docsId);
  }

  
  // @UseGuards(JwtGuard) 
  @Get('/content-docs/:docsId')
  async getDocsConetent(@Param("docsId") docsId: number) {
    return this.docsService.findOne(docsId)
  }

 
  @Get('/content-docs-by-title/:title')
  async getDocsByTitle(@Param('title') title: string) {
    return this.docsService.findByTitle(title);
  }
  
  

  @Role("admin")
  @UseGuards(JwtGuard,RolesGuard)
  @Post('/add-subtitle/:docsId')
  async createSubDocsTitle( @Param('docsId') docsId: number,@Body() createSubDocsDto: CreateSubDocsDto) {
    return this.docsService.createSubTitle(docsId,createSubDocsDto);
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
