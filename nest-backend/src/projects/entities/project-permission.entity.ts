import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Project } from "./project.entity";
import { User } from "src/user/entities/user.entity";

@Entity()

export class ProjectPermission{
    @PrimaryColumn("uuid",{name:"permission_id"})
    permissionId:string;

    @ManyToOne(() => Project, (project) => project.project_permissions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "project_id" })
    project: Project;
  
    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;
}