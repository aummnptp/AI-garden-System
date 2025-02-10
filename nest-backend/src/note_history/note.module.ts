import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProjectHistory } from "src/projects/entities/project-history.entity";
import { Note } from "./entites/note.entity";
import { NoteController } from "./note.controller";
import { NoteService } from "./note.service";
import { Project } from "src/projects/entities/project.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Note, ProjectHistory,Project])],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}