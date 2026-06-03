import { Input } from "./Input";
import { Renderer } from "./Renderer";
import { Settings } from "./config/Settings";
import { WorkspaceManager } from "./WorkspaceManager";
import { WorkspaceBrowser } from "./WorkspaceBrowser";
import { Vector2 } from "../services/Vector2";
import { Node } from "../types/Node";

export class Engine {
    workspaceBrowser: WorkspaceBrowser;
    workspaceManager: WorkspaceManager;
    renderer: Renderer;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    lastTime: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) { 
            throw new Error("Failed to get context");
        }

        this.ctx = ctx;
        this.renderer = new Renderer(ctx);
        this.workspaceManager = new WorkspaceManager();
        this.workspaceBrowser = new WorkspaceBrowser(this.workspaceManager);
        this.lastTime = performance.now();
    }

    start() {
        console.log("ENGINE START");
        console.log(this.workspaceManager.getWorkspaces());
        Input.initialize();
        this.resize();
        window.addEventListener("resize", () => this.resize());

        //const combat = this.workspaceManager.createWorkspace("Combat");
        //this.workspaceManager.createWorkspace("AI");

        //combat.nodes.push(new Node(new Vector2(500, 500), new Vector2(200, 150), "Combat Node"));

        //this.workspaceManager.setActiveWorkspace(combat);

        this.loop();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    loop = () => {
        const now = performance.now();
        const deltaTime = (now - this.lastTime) / 1000;

        this.lastTime = now;
        this.workspaceManager.getActiveWorkspace().update(deltaTime);

        this.workspaceBrowser.update();

        this.ctx.fillStyle = Settings.Theme.Background;

        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.workspaceBrowser.setSize(new Vector2(this.canvas.width * 0.8, this.canvas.height * 0.8));
        this.workspaceBrowser.setPosition(new Vector2(this.canvas.width * 0.1, this.canvas.height * 0.1));
        this.workspaceBrowser.draw(this.renderer);

        this.ctx.save();

        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

        this.workspaceManager.getActiveWorkspace().draw(this.renderer);

        this.ctx.restore();

        Input.endFrame();

        requestAnimationFrame(this.loop);
    };
}