import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { DocsService } from './docs.service';
import { CreateDocsDto, CreateSubDocsDto } from './dto/create-document.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorator/roles-decoraters';
import { UpdateDocumentDto, UpdateSubDocumentDto } from './dto/update-document.dto';



@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) { }

  @Get('/')
  async getDocsTitle() {
    return this.docsService.findAll();
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/add-title')
  async createDocsTitle(@Request() req, @Body() createDocsDto: CreateDocsDto) {
    return this.docsService.create(createDocsDto);
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Patch("/update-docs/:docsId")
  async updateDocs(@Param('docsId') docsId: string, @Request() req, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.docsService.updateDocs(docsId, updateDocumentDto);
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Delete("/delete-docs/:docsId")
  async deleteDocs(@Param('docsId') docsId: string) {
    return this.docsService.delete(docsId);
  }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Delete("/delete-subdocs/:subDocsId")
  async deleteSubDocs(@Param('subDocsId') subDocsId: string) {
    return this.docsService.deleteSubDoc(subDocsId);
  }

  // @UseGuards(JwtGuard) 
  @Get('/content-docs/:docsId')
  async getDocsConetent(@Param("docsId") docsId: string) {
    return this.docsService.getDocs(docsId)
  }

  // @UseGuards(JwtGuard) 
  @Get('/content-subdocs/:subDocsId')
  async getSubDocsConetent(@Param("subDocsId") subDocsId: string) {
    return this.docsService.getSubDocs(subDocsId)
  }

  // @Get('/content-docs-by-title/:title')
  // async getDocsByTitle(@Param('title') title: string) {
  //   return this.docsService.findByTitle(title);
  // }

  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/add-subtitle/:docsId')
  async createSubDocsTitle(@Param('docsId') docsId: string, @Body() createSubDocsDto: CreateSubDocsDto) {
    return this.docsService.createSubTitle(docsId, createSubDocsDto);
  }

  @Role("admin")
  @Patch("update-subdocs/:subDocsId")
  async updateSubDocs(@Param('subDocsId') subDocsId: string, @Request() req, @Body() updateSubDocumentDto: UpdateSubDocumentDto) {
    return this.docsService.updateSubDocs(subDocsId, updateSubDocumentDto);
  }

  @Role("admin")
  @Patch('/save-docs-order')
  async saveDocsOrder(@Request() req,@Body() body: { documents: UpdateDocumentDto[] }) {
    console.log("Received subDocuments to save:", body.documents);

    return this.docsService.saveDocsOrder(body.documents);
  }
  
  @Role("admin")
  @Patch('/save-subdocs-order')
  async saveSubDocsOrder(@Request() req,@Body() body: { subDocuments: UpdateSubDocumentDto[] }) {
    console.log("Received subDocuments to save:", body.subDocuments);

    return this.docsService.saveSubDocsOrder(body.subDocuments);
  }


}
