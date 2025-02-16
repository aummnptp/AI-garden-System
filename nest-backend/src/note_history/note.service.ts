import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ProjectHistory } from "src/projects/entities/project-history.entity";

import { Project } from "src/projects/entities/project.entity";
import { Note } from "./entites/note.entity";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(ProjectHistory)
    private readonly projectHistoryRepository: Repository<ProjectHistory>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
  ) {}

async createHistoryNote(historyId: string, projectId: string, title: string, content: string,userId:string): Promise<Note> {
  
  const user = await this.userRepository.findOne({ where: { userId } });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const history = await this.projectHistoryRepository.findOne({ where: { historyId } });
  if (!history) throw new NotFoundException("History not found");

  const project = await this.projectRepository.findOne({ where: { projectId } });
  if (!project) throw new NotFoundException("Project not found");

  const newNote = this.noteRepository.create({
    title,
    content,
    history,
    project, 
    createdBy: user,
    });

  return this.noteRepository.save(newNote);
}


  async getNotesByHistory(historyId: string): Promise<Note[]> {
    return this.noteRepository.find({ where: { history: { historyId: historyId } },
      relations: ["createdBy"],
    });
  }

  async getNotesByProject(projectId: string): Promise<Note[]> {

    const project = await this.projectRepository.findOne({
        where: { projectId }
    });

    if (!project) {
        throw new NotFoundException("Project not found");
    }

    const notes = await this.noteRepository.find({
        where: { project: { projectId } }, 
        order: { created_at: "DESC" }, 
        relations: ["history", "createdBy"],
    });
    return notes;
}
}
