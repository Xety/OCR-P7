import type { ApiUser } from "@/lib/api/types";

export type ProjectMemberRole = "ADMIN" | "CONTRIBUTOR";
export type ProjectUserRole = ProjectMemberRole | null;
export type ProjectTaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export type ApiProjectMember = {
    id: string;
    role: ProjectMemberRole;
    joinedAt: string;
    userId: string;
    projectId: string;
    user: ApiUser;
};

export type ApiProjectSummary = {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    owner: ApiUser;
    members: ApiProjectMember[];
    _count: {
        tasks: number;
    };
    userRole: ProjectUserRole;
};

export type ApiProjectTask = {
    id: string;
    status: ProjectTaskStatus;
};

export type ApiProjectDetail = ApiProjectSummary & {
    tasks: ApiProjectTask[];
};

export type ProjectCardData = {
    id: string;
    name: string;
    description: string | null;
    owner: ApiUser;
    team: ApiUser[];
    completedTasks: number;
    totalTasks: number;
    progress: number;
};
