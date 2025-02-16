import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ProjectHistory } from "src/projects/entities/project-history.entity";

import { Project } from "src/projects/entities/project.entity";
import { Note } from "./entites/note.entity";

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(ProjectHistory)
    private readonly projectHistoryRepository: Repository<ProjectHistory>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

async createHistoryNote(historyId: string, projectId: string, title: string, content: string): Promise<Note> {
  const history = await this.projectHistoryRepository.findOne({ where: { historyId } });
  if (!history) throw new NotFoundException("History not found");

  const project = await this.projectRepository.findOne({ where: { projectId } });
  if (!project) throw new NotFoundException("Project not found");

  const newNote = this.noteRepository.create({
    title,
    content,
    history,
    project, // ✅ เพิ่ม project เพื่อให้ไม่ NULL
  });

  return this.noteRepository.save(newNote);
}


  async getNotesByHistory(historyId: string): Promise<Note[]> {
    return this.noteRepository.find({ where: { history: { historyId: historyId } } });
  }

  async getNotesByProject(projectId: string): Promise<Note[]> {
    console.log(`🔍 Searching notes for Project ID: ${projectId}`);

    const project = await this.projectRepository.findOne({
        where: { projectId }
    });

    if (!project) {
        console.error("❌ Project not found!");
        throw new NotFoundException("Project not found");
    }

    const notes = await this.noteRepository.find({
        where: { project: { projectId } }, // ✅ เช็คว่า note อยู่ใน project นี้จริง
        order: { created_at: "DESC" }, // ✅ เรียงลำดับล่าสุดขึ้นก่อน
        relations: ["history"], // ✅ ดึงข้อมูล history ด้วย ถ้าต้องใช้
    });

    console.log(`✅ Found ${notes.length} notes.`);
    return notes;
}
}
