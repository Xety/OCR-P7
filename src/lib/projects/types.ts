import type { ApiUser } from "@/lib/api/types";

export type ProjectMemberRole = "ADMIN" | "CONTRIBUTOR";
export type ProjectUserRole = ProjectMemberRole | null;
export type ProjectTaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type ProjectTaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

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

export type ApiProjectTaskSummary = {
    id: string;
    status: ProjectTaskStatus;
};

export type ApiProjectDetail = ApiProjectSummary & {
    tasks: ApiProjectTaskSummary[];
};

export type ApiTaskAssignee = {
    id: string;
    assignedAt: string;
    user: ApiUser;
};

export type ApiTaskComment = {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: ApiUser;
};

export type ApiProjectTask = {
    id: string;
    title: string;
    description: string | null;
    status: ProjectTaskStatus;
    priority: ProjectTaskPriority;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
    projectId: string;
    creatorId: string;
    creator: ApiUser;
    assignees: ApiTaskAssignee[];
    comments: ApiTaskComment[];
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

export type ProjectTeamMember = {
    user: ApiUser;
    role: "ADMIN" | ProjectMemberRole;
};

export type ProjectDetailsData = {
    id: string;
    name: string;
    description: string | null;
    owner: ApiUser;
    members: ApiProjectMember[];
    team: ProjectTeamMember[];
    userRole: ProjectUserRole;
    tasks: ApiProjectTask[];
};

export type ProjectContributorInput = {
    id: string;
    email: string;
    name: string | null;
};

export type ProjectFieldErrors = {
    name?: string[];
    description?: string[];
    contributors?: string[];
};

export type ProjectUpdateState = {
    status?: "success" | "error";
    errors?: ProjectFieldErrors;
    message?: string;
};

export type UserSearchResult = {
    users: ApiUser[];
    message?: string;
};
