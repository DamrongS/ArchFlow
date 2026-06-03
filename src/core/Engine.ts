import { Input } from "./Input";
import { Renderer } from "./Renderer";
import { Workspace } from "./Workspace";
import { Settings } from "./config/Settings";

export class Engine {
    workspace: Workspace;
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
        this.workspace = new Workspace();
        this.lastTime = performance.now();
    }

    start() {
        console.log("ENGINE START");
        Input.initialize();
        this.resize();
        window.addEventListener("resize", () => this.resize());

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
        this.workspace.update(deltaTime);

        this.ctx.fillStyle = Settings.Theme.Background;

        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();

        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

        this.workspace.draw(this.renderer);

        this.ctx.restore();

        Input.endFrame();

        requestAnimationFrame(this.loop);
    };
}