import { Renderer } from "./Renderer";
import { Input } from "./Input";
import { Vector2 } from "../services/Vector2";
import { SidebarNode } from "../types/SidebarNode";
import { SidebarNexus } from "../types/SidebarNexus";
import { Node } from "../types/Node";
import { Settings } from "./config/Settings";
import { Nexus } from "../types/Nexus";

export class WorkspaceSidebar {
    private visible = false;

    private size = new Vector2(250, window.innerHeight + 15);

    private openPosition = new Vector2(
        -window.innerWidth / 2,
        -window.innerHeight / 2 + 15
    );

    private closePosition = new Vector2(
        (-window.innerWidth / 2) - (this.size.x + 5),
        -window.innerHeight / 2 + 15
    );

    private position = this.closePosition.add(
        new Vector2(-100, 50)
    );

    private mouseInside = false;

    private draggingTemplate = false;
    private draggedTemplate: SidebarNode | SidebarNexus | null = null;

    private dragOffset = Vector2.zero();

    private templates = [
        new SidebarNexus(
            new Vector2(20, 20),
            new Vector2(64, 64),
            "Nexus"
        ),

        new SidebarNode(
            new Vector2(20, 200),
            new Vector2(200, 150),
            "Node"
        ),
    ];

    constructor(
        private onCreateNode: (node: Node) => void,
        private onCreateNexus: (nexus: Nexus) => void
    ) { }

    private getMouseScreen(): Vector2 {
        return new Vector2(
            Input.mousePosition.x - window.innerWidth / 2,
            Input.mousePosition.y - window.innerHeight / 2
        );
    }

    containsPoint(point: Vector2): boolean {
        return (
            point.x >= this.position.x &&
            point.x <= this.position.x + this.size.x &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.size.y
        );
    }

    open() {
        this.visible = true;
    }

    close() {
        this.visible = false;
    }

    toggle() {
        this.visible = !this.visible;
    }

    hover(value: boolean) {
        this.mouseInside = value;
    }

    isMouseInside() {
        return this.mouseInside;
    }

    update(dt: number, camera: any) {
        this.size.y = window.innerHeight - 25;

        this.openPosition = new Vector2(
            -window.innerWidth / 2,
            -window.innerHeight / 2 + 5
        );

        this.closePosition = new Vector2(
            (-window.innerWidth / 2) - (this.size.x + 6),
            -window.innerHeight / 2 + 5
        );

        if (Input.isKeybindsPressed(Settings.Keybinds.ToggleSidebar)) {
            this.toggle();
        }

        this.position = this.visible
            ? this.position.lerp(this.openPosition, 20 * dt)
            : this.position.lerp(this.closePosition, 20 * dt);

        const sidebarPosition = this.position.copy();

        this.templates[0].move(
            sidebarPosition.add(new Vector2(20, 25))
        );

        this.templates[1].move(
            sidebarPosition.add(new Vector2(20, 220))
        );

        const mousePosition = this.getMouseScreen();

        if (Input.isMousePressed(0)) {
            for (const template of this.templates) {
                if (!template.containsPoint(mousePosition)) continue;

                console.log("Dragging", template);

                this.draggingTemplate = true;
                this.draggedTemplate = template;
                this.dragOffset = mousePosition.sub(template.position);

                template.startDrag();
                break;
            }
        }

        if (
            this.draggingTemplate &&
            this.draggedTemplate &&
            Input.isMouseReleased(0)
        ) {
            this.draggingTemplate = false;

            this.draggedTemplate.stopDrag();

            if (this.draggedTemplate instanceof SidebarNode) {
                const draggedPosition =
                    mousePosition.sub(this.dragOffset);

                const node = new Node(
                    draggedPosition.div(camera.zoom)
                        .add(camera.position),
                    new Vector2(200, 150),
                    "Node",
                    new Vector2(200, 150)
                );

                this.onCreateNode(node);
            } else if (this.draggedTemplate instanceof SidebarNexus) {
                const draggedPosition =
                    mousePosition.sub(this.dragOffset);

                const nexus = new Nexus(
                    draggedPosition.div(camera.zoom).add(camera.position),
                    camera.zoom,
                    "Nexus Node",
                    new Vector2(64, 64)
                );

                this.onCreateNexus(nexus);
            }

            this.draggedTemplate = null;
        }
    }

    draw(renderer: Renderer) {
        renderer.rect(
            this.position,
            this.size,
            Settings.Theme.Node.Background,
            Settings.Theme.Node.Border
        );

        const mousePosition = this.getMouseScreen()
        const draggedPosition = mousePosition.sub(this.dragOffset!);

        for (const template of this.templates) {
            template.draw(renderer, draggedPosition);
        }
    }
}