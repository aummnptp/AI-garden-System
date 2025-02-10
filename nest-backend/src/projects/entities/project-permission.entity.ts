import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Project } from "./project.entity";
import { User } from "src/user/entities/user.entity";

@Entity()
@Unique(["project", "user"]) 
export class ProjectPermission{
    @PrimaryGeneratedColumn("uuid",{name:"permission_id"})
    permissionId:string;

    @ManyToOne(() => Project, (project) => project.project_permissions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "project_id" })
    project: Project;
  
    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;
}