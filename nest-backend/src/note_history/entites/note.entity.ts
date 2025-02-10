import { ProjectHistory } from "src/projects/entities/project-history.entity";
import { Project } from "src/projects/entities/project.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity(`note_history`)
export class Note {
@PrimaryGeneratedColumn("uuid",{name:"note_id"})
noteId: string;
@Column()
title: string;

@Column("text")
content: string;

@CreateDateColumn()
created_at: Date;

@ManyToOne(() => ProjectHistory, (history) => history.image_notes, { onDelete: "CASCADE" })
@JoinColumn({ name: "history_id" })
history: ProjectHistory;

@ManyToOne(() => Project, (project) => project.notes, { onDelete: "CASCADE" })
@JoinColumn({ name: "project_id" })
project: Project;
}