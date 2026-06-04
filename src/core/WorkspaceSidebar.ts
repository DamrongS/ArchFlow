import { Renderer } from "./Renderer";
import { Input } from "./Input";
import { Vector2 } from "../services/Vector2";
import { SidebarNode } from "../types/SidebarNode";
import { Node } from "../types/Node";

export class WorkspaceSidebar {
    private visible = false;
    private size: Vector2 = new Vector2(250, window.innerHeight - 25)

    private openPosition: Vector2 = new Vector2(-window.innerWidth / 2, -(window.innerHeight / 2))
    private closePosition: Vector2 = new Vector2((-window.innerWidth / 2) - this.size.x, -(window.innerHeight / 2))

    private position: Vector2 = this.closePosition

    private NodeTemplate: SidebarNode
    private mouseInside: boolean = false;
    private draggingTemplate = false;
    private dragOffset: Vector2 = new Vector2(0, 0);

    constructor(private onCreateNode: (node: Node) => void) {
        this.NodeTemplate = new SidebarNode(new Vector2(0, 0), new Vector2(200, 150), "Node")
    }

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

    hover(bool: boolean) {
        this.mouseInside = bool;
    }

    isMouseInside() {
        return this.mouseInside;
    }

    update(dt: number) {
        this.size.y = window.innerHeight - 25;
        this.openPosition = new Vector2(-window.innerWidth / 2, -(window.innerHeight / 2))
        this.closePosition = new Vector2((-window.innerWidth / 2) - this.size.x, -(window.innerHeight / 2))

        this.closePosition.x = (-window.innerWidth / 2) - this.size.x;

        if (Input.isKeyPressed("Tab")) {
            this.toggle();
        }

        if (this.visible) {
            this.position = this.position.lerp(this.openPosition, 20 * dt)
        } else {
            this.position = this.position.lerp(this.closePosition, 20 * dt)
        }

        let SidebarPosition = this.position.copy()
        this.NodeTemplate.move(SidebarPosition.add(new Vector2(20, 25)));

        const mousePosition = this.getMouseScreen();
        if (this.NodeTemplate.containsPoint(mousePosition) && Input.isMousePressed(0)) {
            console.log("START DRAG");
            this.draggingTemplate = true;
            this.dragOffset = mousePosition.sub(this.NodeTemplate.position);
            this.NodeTemplate.startDrag();
        }

        if (this.draggingTemplate && Input.isMouseReleased(0)) {
            console.log("STOP DRAG");
            this.draggingTemplate = false;
            this.NodeTemplate.stopDrag();

            const mousePosition = this.getMouseScreen()
            const draggedPosition = mousePosition.sub(this.dragOffset!);
            const node = new Node(draggedPosition, new Vector2(200, 150), "Node");

            this.onCreateNode(node);
        }
    }

    draw(renderer: Renderer) {
        renderer.rect(this.position, this.size);

        const mousePosition = this.getMouseScreen()
        const draggedPosition = mousePosition.sub(this.dragOffset!);

        this.NodeTemplate.draw(renderer, draggedPosition);
    }
}