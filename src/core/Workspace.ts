import { Camera } from "./Camera";
import { Renderer } from "./Renderer";
import { Vector2 } from "../services/Vector2";
import { Input } from "./Input";
import { Settings } from "./config/Settings";
import { Node } from "../types/Node";

export class Workspace {
    camera: Camera;
    nodes: Node[] = [];
    private dragStartWorld: Vector2 | null = null;
    private wasDragging = false;

    hoveredNode: Node | null = null;
    selectedNode: Node | null = null;

    private draggedNode: Node | null = null;
    private nodeDragStartMouse: Vector2 | null = null;
    private nodeDragStartPosition: Vector2 | null = null;

    constructor() {
        this.camera = new Camera();

        this.nodes.push(
        new Node(new Vector2(0, 0), new Vector2(200, 150),"Node"));
    }

    worldToScreen(position: Vector2): Vector2 {
        return position.sub(this.camera.position).mult(this.camera.zoom);
    }

    screenToWorld(position: Vector2): Vector2 {
        return position.div(this.camera.zoom).add(this.camera.position);
    }

    update(dt: number) {
        const mouseScreen = new Vector2(Input.mousePosition.x - window.innerWidth / 2, Input.mousePosition.y - window.innerHeight / 2);

        const mouseWorldBefore = this.screenToWorld(mouseScreen);
        const zoomSpeed = Settings.Camera.ZoomSpeed;
        if (Input.wheelDelta > 0) {
            this.camera.zoom -= zoomSpeed;
        }

        if (Input.wheelDelta < 0) {
            this.camera.zoom += zoomSpeed;
        }

        this.camera.zoom = Math.max(Settings.Camera.MinZoom, Math.min(Settings.Camera.MaxZoom, this.camera.zoom));

        const mouseWorldAfter = this.screenToWorld(mouseScreen);

        this.camera.position = this.camera.position.add(mouseWorldBefore.sub(mouseWorldAfter));

        if (Input.isKeyDown("ControlLeft")) {
            console.log("CTRL HELD");
        }

        if (Input.isMouseDown(2)) {
            if (!this.wasDragging) {
                this.dragStartWorld = this.screenToWorld(mouseScreen);
                this.wasDragging = true;
            }
            const currentWorld = this.screenToWorld(mouseScreen);
            this.camera.position = this.camera.position.add(this.dragStartWorld!.sub(currentWorld));
        } else {
            this.wasDragging = false;
            this.dragStartWorld = null;
        }

        // if (Input.isMouseDown(1)) {
            // console.log("MIDDLE CLICK");
        // }

        // if (Input.isMouseDown(0)) {
            // console.log("LEFT CLICK");
        // }

        const mouseWorld = this.screenToWorld(mouseScreen);
        let foundHover = false;
        for (const node of this.nodes) {
            if (node.containsPoint(mouseWorld)) {
                foundHover = true;
                if (this.hoveredNode !== node && !this.wasDragging) {
                    if (this.hoveredNode) {
                        this.hoveredNode.unhover();
                    }

                    node.hover();
                    this.hoveredNode = node;
                }
                break;
            }
        }

        if (!foundHover && this.hoveredNode) {
            this.hoveredNode.unhover();
            this.hoveredNode = null;
        }

        if (Input.isMousePressed(0) && this.hoveredNode) {
            this.selectedNode?.deselect();

            this.selectedNode = this.hoveredNode;
            this.selectedNode.select();
        } else if (Input.isMousePressed(0) && !this.hoveredNode) {
            this.selectedNode?.deselect();
            this.selectedNode = null;
        }

        // Start drag
        if (Input.isMousePressed(0) && this.hoveredNode) {
            this.draggedNode = this.hoveredNode;

            this.nodeDragStartMouse = mouseWorld.copy();
            this.nodeDragStartPosition = this.draggedNode.position.copy();
        }

        // While dragging
        if (Input.isMouseDown(0) && this.draggedNode && this.nodeDragStartMouse && this.nodeDragStartPosition) {
            const delta = mouseWorld.sub(this.nodeDragStartMouse);
            this.draggedNode.move(this.nodeDragStartPosition.add(delta));
        }

        // Stop drag
        if (!Input.isMouseDown(0)) {
            this.draggedNode = null;
            this.nodeDragStartMouse = null;
            this.nodeDragStartPosition = null;
        }
    }

    private drawGrid(renderer: Renderer) {
        if (!Settings.Grid.Visible) {
            return;
        }

        const gridSize = Settings.Grid.Size;

        const leftWorld = this.camera.position.x - window.innerWidth / (2 * this.camera.zoom);
        const rightWorld = this.camera.position.x + window.innerWidth / (2 * this.camera.zoom);
        const topWorld = this.camera.position.y - window.innerHeight / (2 * this.camera.zoom);
        const bottomWorld = this.camera.position.y + window.innerHeight / (2 * this.camera.zoom);

        const startX = Math.floor(leftWorld / gridSize) * gridSize;
        const startY = Math.floor(topWorld / gridSize) * gridSize;

        for (let x = startX; x <= rightWorld; x += gridSize) {
            const start = this.worldToScreen(new Vector2(x, topWorld));
            const end = this.worldToScreen(new Vector2(x, bottomWorld));

            if (x % (gridSize * Settings.Grid.MajorLineFrequency) === 0) {
                renderer.line(start, end, Settings.Theme.Grid.Major);
            } else {
                renderer.line(start, end, Settings.Theme.Grid.Minor);
            }
        }

        for (let y = startY; y <= bottomWorld; y += gridSize) {
            const start = this.worldToScreen(new Vector2(leftWorld, y));
            const end = this.worldToScreen(new Vector2(rightWorld, y));

            if (y % (gridSize * Settings.Grid.MajorLineFrequency) === 0) {
                renderer.line(start, end, Settings.Theme.Grid.Major);
            } else {
                renderer.line(start, end, Settings.Theme.Grid.Minor);
            }
        }
    }

    drawNodes(renderer: Renderer) {
        for (const node of this.nodes) {
            const screenPos = this.worldToScreen(node.position);

            node.draw(renderer, screenPos, this.camera.zoom);
        }
    }


    draw(renderer: Renderer) {
        this.drawGrid(renderer);
        this.drawNodes(renderer);
    }
}