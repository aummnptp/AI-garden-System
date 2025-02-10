import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectPermission } from "./entities/project-permission.entity";
import { Project } from "./entities/project.entity";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class  ProjectPermissionService{
    constructor(
    @InjectRepository(ProjectPermission)
    private readonly projectPermissionRepository: Repository<ProjectPermission>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
    ){}

    async grantPermission(projectId: string, userId: string): Promise<ProjectPermission> {
      const project = await this.projectRepository.findOne({ where: { projectId } });
      if (!project) throw new NotFoundException("Project not found");
      const user = await this.userRepository.findOne({ where: { userId } });
      if (!user) throw new NotFoundException("User not found");
      const newPermission = this.projectPermissionRepository.create({ project, user });
      return this.projectPermissionRepository.save(newPermission);
    }

    async updatePermission(projectId: string, userId: string,): Promise<ProjectPermission> {
      const permission = await this.projectPermissionRepository.findOne({
        where: { project: { projectId }, user: { userId } },
      });
      if (!permission) {
        throw new NotFoundException("Permission not found");
      }
      return this.projectPermissionRepository.save(permission);
    }
  
    async revokePermission(projectId: string, userId: string): Promise<void> {
      const permission = await this.projectPermissionRepository.findOne({
        where: { project: { projectId }, user: { userId } },
      });
      if (!permission) {
        throw new NotFoundException("Permission not found");
      }
  
      await this.projectPermissionRepository.remove(permission);
    }
  
    async getProjectPermissions(projectId: string): Promise<ProjectPermission[]> {
      return this.projectPermissionRepository.find({
        where: { project: { projectId } },
        relations: ["user"],
      });
    }
}