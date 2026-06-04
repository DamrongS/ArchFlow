import { WorkspaceManager } from "./WorkspaceManager";
import { Renderer } from "./Renderer";
import { Vector2 } from "../services/Vector2";
import { Input } from "./Input";
import { WorkspaceCard } from "./WorkspaceCard";

export class WorkspaceBrowser {
    private visible: boolean = true;
    private position = new Vector2(0, 0);
    private createButtonPosition = new Vector2(0, 0);
    private cards: WorkspaceCard[] = [];

    private size = new Vector2(600, 400);

    constructor(
        private workspaceManager: WorkspaceManager
    ) { }

    private rebuildCards() {
        const workspaces = this.workspaceManager.getWorkspaces();

        this.cards = [];
        for (let i = 0; i < workspaces.length; i++) {
            this.cards.push(new WorkspaceCard(workspaces[i], this.position.add(new Vector2(140 + i * 120, 20))));
        }
    }

    open() {
        this.rebuildCards();
        this.visible = true;
    }

    close() {
        this.visible = false;
    }

    toggle() {
        if (this.visible) {
            this.close();
            return;
        }

        this.open();
    }

    setPosition(position: Vector2) {
        this.position = position;

        if (this.visible) {
            this.rebuildCards();
        }
    }

    getSize(): Vector2 {
        return this.size;
    }

    setSize(size: Vector2) {
        this.size = size;
    }

    update() {
        if (!this.visible) {
            return;
        }

        if (!Input.isMousePressed(0)) {
            return;
        }

        const mouse = Input.mousePosition;

        const hoveringCreateButton =
            mouse.x >= this.createButtonPosition.x &&
            mouse.x <= this.createButtonPosition.x + 100 &&
            mouse.y >= this.createButtonPosition.y &&
            mouse.y <= this.createButtonPosition.y + 100;

        if (hoveringCreateButton) {
            const workspaceCount = this.workspaceManager.getWorkspaces().length;
            const workspace = this.workspaceManager.createWorkspace(
                `Workspace ${workspaceCount + 1}`
            );

            this.workspaceManager.setActiveWorkspace(workspace);
            this.close();
            return;
        }

        for (const card of this.cards) {
            if (card.contains(mouse)) {
                this.workspaceManager.setActiveWorkspace(card.workspace);

                this.close();
                return;
            }
        }
    }

    draw(renderer: Renderer) {
        if (!this.visible) {
            return;
        }

        renderer.rect(
            this.position,
            this.size,
            "#252526",
            "#3a3a3a",
            1
        );

        this.createButtonPosition = this.position.add(new Vector2(20, 20));

        renderer.rect(this.createButtonPosition, new Vector2(100, 100));
        renderer.text("+", this.createButtonPosition.add(new Vector2(45, 55)));

        for (const card of this.cards) {
            card.draw(renderer);
        }

        // Tegn baggrund
        // Tegn [+]
        // Tegn workspace previews
    }
}