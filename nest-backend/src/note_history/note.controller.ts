import { Controller, Post, Body, Param, Get, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt-auth.guard";
import { NoteService } from "./note.service";

@Controller("projects/:projectId/notes")
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(JwtGuard)
  @Post("add-note/:historyId")
  async createNote(
    @Param("historyId") historyId: string,
    @Param("projectId") projectId: string,
    @Body("title") title: string,
    @Body("content") content: string
  ) {

    return this.noteService.createHistoryNote(historyId, projectId, title, content);  }

  @UseGuards(JwtGuard)
  @Get(":historyId") //  เปลี่ยนให้ path กระชับ
  async getNotes(@Param("historyId") historyId: string) {
    return this.noteService.getNotesByHistory(historyId);
  }

  @UseGuards(JwtGuard)
  @Get() 
  async getProjectNotes(@Param("projectId") projectId: string) {
  
    return this.noteService.getNotesByProject(projectId);
  }
}