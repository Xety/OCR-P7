export type BackendProjectRole = "ADMIN" | "CONTRIBUTOR" | null;
export type ProjectRole = "ADMIN" | "CONTRIBUTOR";

export type ProjectPermission =
    | "viewProject"
    | "updateProject"
    | "deleteProject"
    | "manageMembers"
    | "viewTasks"
    | "createTasks"
    | "updateTasks"
    | "deleteTasks";

export type ProjectAccess = {
    ownerId: string;
    userRole: BackendProjectRole;
};

const ROLE_PERMISSIONS: Record<ProjectRole, readonly ProjectPermission[]> = {
    ADMIN: [
        "viewProject",
        "updateProject",
        "deleteProject",
        "manageMembers",
        "viewTasks",
        "createTasks",
        "updateTasks",
        "deleteTasks",
    ],
    CONTRIBUTOR: [
        "viewProject",
        "viewTasks",
        "createTasks",
        "updateTasks",
        "deleteTasks",
    ],
};

export function canCreateProject(isAuthenticated: boolean) {
    return isAuthenticated;
}

export function resolveProjectRole(
    project: ProjectAccess,
    userId: string,
): ProjectRole | null {
    if (project.ownerId === userId) {
        return "ADMIN";
    }

    return project.userRole;
}

export function hasProjectPermission(
    role: ProjectRole | null,
    permission: ProjectPermission,
) {
    return role ? ROLE_PERMISSIONS[role].includes(permission) : false;
}
