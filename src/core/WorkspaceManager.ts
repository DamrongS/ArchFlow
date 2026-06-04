import { Workspace } from "./Workspace";

export class WorkspaceManager {

    private workspaces: Workspace[] = [];

    private activeWorkspace: Workspace;

    constructor() {
        const workspace = new Workspace("Workspace Template");

        this.workspaces.push(workspace);

        this.activeWorkspace = workspace;
    }

    getActiveWorkspace(): Workspace {
        return this.activeWorkspace;
    }

    setActiveWorkspace(workspace: Workspace) {
        workspace.activate()
        this.activeWorkspace = workspace;
    }

    getWorkspaces(): Workspace[] {
        return this.workspaces;
    }

    createWorkspace(name: string): Workspace {
        const workspace = new Workspace(name);
        this.workspaces.push(workspace);

        return workspace;
    }

    removeWorkspace(workspace: Workspace) {
        const index = this.workspaces.indexOf(workspace);
        if (index !== -1) {
            this.workspaces.splice(index, 1);
        }
    }
}